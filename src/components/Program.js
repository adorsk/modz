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
        key={mod.id}
        mod={mod}
        style={{
          position: 'absolute',
          left: mod.position.x,
          top: mod.position.y,
        }}
        afterMount={(el) => { this.modRefs[mod.id] = el }}
        beforeUnmount={() => { delete this.modRefs[mod.id] }}
        setOutputValues={({outputValues}) => {
          this.setModOutputValues({mod, outputValues})
          this.propagateModOutputValues({mod, outputValues})
        }}
        loadModule={this.props.loadModModule}
      />
    )
  }

  setModOutputValues ({mod, outputValues}) {
    this._updateMod({
      mod,
      updates: {
        outputs: {
          ...mod.outputs,
          values: outputValues,
        }
      }
    })
  }

  _updateMod ({mod, updates}) {
    return this.props.updateMod({id: mod.id, updates})
  }

  propagateModOutputValues ({mod, outputValues}) {
    const wiresFromMod = this._wiresFromMod[mod.id]
    _.each(outputValues, (outputValue, ioId) => {
      const outgoingWires = _.get(wiresFromMod, ioId, [])
      for (let wire of outgoingWires) {
        const destMod = this.props.program.mods[wire.dest.modId]
        this.setModInputValues({
          mod: destMod,
          inputValues: {
            ...destMod.inputs.values,
            [wire.dest.ioId]: outputValue,
          }
        })
      }
    })
  }

  setModInputValues ({mod, inputValues}) {
    this._updateMod({
      mod,
      updates: {
        inputs: {
          ...mod.inputs,
          values: inputValues,
        }
      }
    })
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
        key={wire.id}
        afterMount={(el) => { this.wireRefs[wire.id] = el }}
        beforeUnmount={() => { delete this.wireRefs[wire.id] }}
      />
    )
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
        [src.modId, src.ioId],
        (_wires) => _wires ? _wires.concat(wire) : [wire]
      )
      _.update(
        this._wiresToMod,
        [dest.modId, dest.ioId],
        (_wires) => _wires ? _wires.concat(wire) : [wire]
      )
      const srcModRef = this.modRefs[src.modId]
      const srcHandlePos = srcModRef.getIoHandlePosition({ioId: src.ioId})
      const destModRef = this.modRefs[dest.modId]
      const destHandlePos = destModRef.getIoHandlePosition({ioId: dest.ioId})
      const wireRef = this.wireRefs[wire.id]
      wireRef.setPositions({
        src: srcHandlePos,
        dest: destHandlePos,
      })
    })
  }
}

export default Program
