import React from 'react'
import _ from 'lodash'

import IoHandle from './IoHandle.js'

class Mod extends React.Component {
  constructor (props) {
    super(props)
    this.ioHandleRefs = {}
  }

  render () {
    const { mod, style } = this.props
    return (
      <div
        className='mod-container'
        style={style}
      >
        <div
          className='mod-frame'
          style={{
            width: mod.dimensions.width,
            height: mod.dimensions.height,
            border: 'thin solid gray',
          }}
        >
          {
            (mod.status === 'IMPORTED') ?
              this.renderLoaded()
              : `STATUS: ${mod.status}`
          }
        </div>
      </div>
    )
  }

  renderLoaded () {
    return [
      this.renderLabel(),
      this.renderBody(),
    ]
  }

  renderLabel () {
    const { mod } = this.props
    return (<label key="label" className='mod-name'>{mod.label}</label>)
  }

  renderBody () {
    return (
      <div key="body" className='mod-body'>
        {this.renderActionButtons()}
        <div>
          {this.renderInputHandles()}
          {this.renderModInterface()}
          {this.renderOutputHandles()}
        </div>
      </div>
    )
  }

  renderActionButtons () {
    return (
      <div className='mod-actions'>TK: actions</div>
    )
  }

  renderInputHandles () {
    return this.renderIoHandleGroup({
      groupType: 'input',
      ioDefs: this.props.mod.inputs,
    })
  }

  renderIoHandleGroup ({groupType, ioDefs}) {
    return (
      <div className={`io-handles ${groupType}-handles`}>
        {
          _.sortBy(ioDefs, 'position')
            .map((ioDef) => {
              return this.renderIoHandle({
                ioDef,
                ioType: groupType
              })
            })
        }
      </div>
    )
  }

  renderIoHandle ({ioDef, ioType}) {
    return (
      <IoHandle
        key={ioDef.key}
        ioDef={ioDef}
        ioType={ioType}
        afterMount={(el) => {
          this.ioHandleRefs[ioDef.key] = el
        }}
        beforeUnmount={(el) => {
          delete this.ioHandleRefs[ioDef.key]
        }}
      />
    )
  }

  renderOutputHandles () {
    return this.renderIoHandleGroup({
      groupType: 'output',
      ioDefs: this.props.mod.outputs,
    })
  }

  renderModInterface () {
    return (
      <div className='mod-interface-container'>TK: Mod Interface</div>
    )
  }

  componentDidMount () {
    if (this.props.afterMount) { this.props.afterMount(this) }
    // call mod's setupInterface method.
    // init mod? (I think no...bc that's affecting program state)
  }

  componentWillUnmount () {
    if (this.props.beforeUnmount) { this.props.beforeUnmount(this) }
  }

  getIoHandlePosition ({ioType, ioKey}) {
    if (! this.ioHandleRefs[ioKey]) { return null }
    return this.ioHandleRefs[ioKey].getPosition()
  }
}

export default Mod
