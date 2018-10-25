import React from 'react'
import _ from 'lodash'

import Mod from './Mod.js'
import Wire from './Wire.js'


class Program extends React.Component {
  constructor (props) {
    super(props)
    this.modRefs = {}
    this.wireRefs = {}
    this._wiresFromMod = {}
    this._wiresToMod = {}
  }

  render () {
    const { program } = this.props
    if (! program) { return null } 
    return (
      <div>
        <div
          className='program-container'
          style={{position: 'relative'}}
        >
          {this.renderMods({mods: program.mods})}
          {this.renderWires({wires: program.wires})}
        </div>
      </div>
    )
  }

  renderMods ({mods}) {
    return (
      <div
        className='mods-container'
        style={{position: 'absolute'}}
      >
        {
          _.map(mods, (mod) => {
            return this.renderMod({mod})
          })
        }
      </div>
    )
  }

  renderMod ({mod}) {
    return (
      <Mod
        key={mod.key}
        mod={mod}
        style={{
          position: 'absolute',
          left: mod.position.x,
          top: mod.position.y,
        }}
        afterMount={(el) => { this.modRefs[mod.key] = el }}
        beforeUnmount={() => { delete this.modRefs[mod.key] }}
        setOutputValues={({outputValues}) => {
          this.props.setModOutputValues({modKey: mod.key, outputValues})
          // @TODO: fix this. hacky workaround until we break
          // out mods into their own state, separate from program.
          setTimeout(() => {
            this.propagateModOutputValues({modKey: mod.key, outputValues})
          }, 0)
        }}
      />
    )
  }

  renderWires ({wires}) {
    return (
      <svg
        className='wires-container'
        style={{
          position: 'absolute',
          overflow: 'visible',
          width: 2,
          height: 2,
        }}
      >
        {
          _.map(wires, (wire) => {
            return this.renderWire({wire})
          })
        }
      </svg>
    )
  }

  renderWire ({wire}) {
    return (
      <Wire
        key={wire.key}
        afterMount={(el) => { this.wireRefs[wire.key] = el }}
        beforeUnmount={() => { delete this.wireRefs[wire.key] }}
      />
    )
  }

  propagateModOutputValues ({modKey, outputValues}) {
    const wiresFromMod = this._wiresFromMod[modKey]
    _.each(outputValues, (outputValue, ioKey) => {
      const outgoingWires = _.get(wiresFromMod, ioKey, [])
      for (let wire of outgoingWires) {
        const destMod = this.props.program.mods[wire.dest.modKey]
        this.props.setModInputValues({
          modKey: destMod.key,
          inputValues: {
            ...destMod.inputs.values,
            [wire.dest.ioKey]: outputValue,
          }
        })
      }
    })
  }

  componentDidMount () {
    this.updateWires()
  }

  componentDidUpdate () {
    this.updateWires()
  }

  updateWires () {
    if (! this.props.program) { return }
    this._wiresFromMod = {}
    this._wiresToMod = {}
    _.each(this.props.program.wires, (wire) => {
      const { src, dest } = wire
      _.update(
        this._wiresFromMod,
        [src.modKey, src.ioKey],
        (_wires) => _wires ? _wires.concat(wire) : [wire]
      )
      _.update(
        this._wiresToMod,
        [dest.modKey, dest.ioKey],
        (_wires) => _wires ? _wires.concat(wire) : [wire]
      )
      const srcModRef = this.modRefs[src.modKey]
      const srcHandlePos = srcModRef.getIoHandlePosition({ioKey: src.ioKey})
      const destModRef = this.modRefs[dest.modKey]
      const destHandlePos = destModRef.getIoHandlePosition({ioKey: dest.ioKey})
      const wireRef = this.wireRefs[wire.key]
      wireRef.setPositions({
        src: srcHandlePos,
        dest: destHandlePos,
      })
    })
  }
}

export default Program
