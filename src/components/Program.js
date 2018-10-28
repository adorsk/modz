import React from 'react'
import _ from 'lodash'
import interact from 'interactjs'

import Mod from './Mod.js'
import Wire from './Wire.js'
import AddWireForm from './AddWireForm.js'


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
      <div className='program'>
        <div>
          {this._renderAddWireForm()}
        </div>
        <div
          className='program-content-container'
          style={{position: 'relative'}}
        >
          {this.renderMods({mods: program.mods})}
          {this.renderWires({wires: program.wires})}
        </div>
      </div>
    )
  }

  _renderAddWireForm () {
    return (
      <AddWireForm
        ioHandleInfos={this._getIoHandleInfos()}
        addWire={this._addWire.bind(this)}
      />
    )
  }

  _getIoHandleInfos () {
    const { program } = this.props
    const ioTypes = ['inputs', 'outputs']
    const ioHandleInfos = {}
    _.each(program.mods, (mod, modId) => {
      for (let ioType of ioTypes) {
        _.each(mod[ioType].handles, (handle, handleId) => {
          const infoId = [modId, ioType, handleId].join(':')
          ioHandleInfos[infoId] = {
            id: infoId,
            modId,
            ioType,
            handle
          }
        })
      }
    })
    return ioHandleInfos
  }

  _addWire ({src, dest}) {
    const { program } = this.props
    this.props.addWire({props: {program, src, dest}})
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
        afterMount={(el) => {
          this.modRefs[mod.id] = el 
          interact(el.labelRef.current).draggable({
            restrict: false,
            autoScroll: true,
            onmove: (dragEvent) => {
              const _mod = this.props.program.mods[mod.id] // closures!
              this._updateMod({
                mod: _mod,
                updates: {
                  position: {
                    x: _mod.position.x + dragEvent.dx,
                    y: _mod.position.y + dragEvent.dy
                  }
                }
              })
            },
          })
        }}
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
    this.props.updateModIoValues({
      id: mod.id,
      ioType: 'outputs',
      updates: outputValues
    })
  }

  _updateMod ({mod, updates}) {
    return this.props.updateMod({id: mod.id, updates})
  }

  propagateModOutputValues ({mod, outputValues}) {
    _.each(
      _.values(this._wiresFromMod[mod.id]),
      (wire) => this._propagateOutputForWire({
        wire,
        value: outputValues[wire.src.ioId]
      })
    )
  }

  _propagateOutputForWire (opts) {
    const { wire } = opts
    const { program } = this.props
    const { src, dest } = wire
    let srcValue
    if (_.has(opts, 'value')) {
      srcValue = opts.value
    } else {
      const srcMod = program.mods[src.modId]
      srcValue = srcMod[src.ioType].values[src.ioId]
    }
    this.props.updateModIoValues({
      id: dest.modId,
      ioType: dest.ioType,
      updates: {[dest.ioId]: srcValue}
    })
  }

  setModInputValues ({mod, inputValues}) {
    this.props.updateModIoValues({
      id: mod.id,
      ioType: 'inputs',
      updates: inputValues
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
    this._updateWires()
  }

  componentDidUpdate (prevProps) {
    this._updateWires()
    const wireDiff = this._computeWireDiff({prevProps})
    this._propagateOutputsForWires({wires: wireDiff.added})
  }

  _updateWires () {
    if (! this.props.program) { return }
    this._updateWireRegistry()
    this._updateWirePaths()
  }

  _updateWireRegistry () {
    const wires = this.props.program.wires
    this._wiresFromMod = _.groupBy(wires, _.property(['src', 'modId']))
    this._wiresToMod = _.groupBy(wires, _.property(['dest', 'modId']))
  }

  _updateWirePaths () {
    _.each(this.props.program.wires, (wire) => {
      const { src, dest } = wire
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

  _computeWireDiff ({prevProps}) {
    const _getWires = _.property(['program', 'wires'])
    const prevWires = _getWires(prevProps)
    const currentWires = _getWires(this.props)
    return {
      added: _.omit(currentWires, _.keys(prevWires)),
      removed: _.omit(prevWires, _.keys(currentWires)),
    }
  }

  _propagateOutputsForWires ({wires}) {
    _.each(wires, (wire) => this._propagateOutputForWire({wire}))
  }
}

export default Program
