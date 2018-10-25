import React from 'react'
import _ from 'lodash'

import Mod from './Mod.js'
import Wire from './Wire.js'


class Program extends React.Component {
  constructor (props) {
    super(props)
    this.modRefs = {}
    this.wireRefs = {}
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

  componentDidMount () {
    this.updateWires()
  }

  componentDidUpdate () {
    this.updateWires()
  }

  updateWires () {
    if (! this.props.program) { return }
    _.each(this.props.program.wires, (wire) => {
      const { src, dest } = wire
      const srcMod = this.modRefs[src.modKey]
      const srcHandlePos = srcMod.getIoHandlePosition({ioKey: src.ioKey})
      const destMod = this.modRefs[dest.modKey]
      const destHandlePos = destMod.getIoHandlePosition({ioKey: dest.ioKey})
      const wireRef = this.wireRefs[wire.key]
      wireRef.setPositions({
        src: srcHandlePos,
        dest: destHandlePos,
      })
    })
  }
}

export default Program
