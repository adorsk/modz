import React from 'react'
import _ from 'lodash'

import IoHandle from './IoHandle.js'

class Mod extends React.Component {
  constructor (props) {
    super(props)
    this.ioHandleRefs = {}
    this.interfaceContainerRef = React.createRef()
    this.modInstance = null
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
      <div className='mod-actions'>
        <button onClick={() => { this.runMod() }}>
          run
        </button>
      </div>
    )
  }

  runMod () {
    const outputValues = (
      this.modInstance.run({
        inputValues: _.get(this.props.mod, ['inputs', 'values'], {})
      })
      || {}
    )
    this.props.setOutputValues({outputValues})
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
          _.sortBy(ioDefs.handles, 'position')
            .map((handleDef) => {
              return this.renderIoHandle({
                handleDef,
                ioType: groupType,
                value: ioDefs.values[handleDef.key],
              })
            })
        }
      </div>
    )
  }

  renderIoHandle ({handleDef, ioType, value}) {
    return (
      <IoHandle
        key={handleDef.key}
        handleDef={handleDef}
        value={value}
        ioType={ioType}
        afterMount={(el) => {
          this.ioHandleRefs[handleDef.key] = el
        }}
        beforeUnmount={(el) => {
          delete this.ioHandleRefs[handleDef.key]
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
      <div
        ref={this.interfaceContainerRef}
        className='mod-interface-container'>
        TK: Mod Interface
      </div>
    )
  }

  componentDidMount () {
    if (this.props.afterMount) { this.props.afterMount(this) }
  }

  componentDidUpdate (prevProps) {
    const didImport = (
      (prevProps.mod.status === 'IMPORTING')
      && (this.props.mod.status === 'IMPORTED')
    )
    if (didImport) {
      this.initializeMod()
      return
    }
    const inputValuesPath = ['mod', 'inputs', 'values']
    const inputValues = _.get(this.props, inputValuesPath)
    const prevInputValues = _.get(prevProps, inputValuesPath)
    const inputValuesHaveChanged = (! _.isEqual(inputValues, prevInputValues))
    if (inputValuesHaveChanged) { this.runMod() }
  }

  initializeMod () {
    // @TODO: clean this up Not sure yet what to call these.
    // module? factory? renderInto?
    const module = this.props.mod.module
    this.modInstance = module.factory()
    this.modInstance.renderInto({parentNode: this.interfaceContainerRef.current})
  }

  componentWillUnmount () {
    if (this.modInstance && this.modInstance.destroy) {
      this.modInstance.destroy()
    }
    if (this.props.beforeUnmount) { this.props.beforeUnmount(this) }
  }

  getIoHandlePosition ({ioType, ioKey}) {
    if (! this.ioHandleRefs[ioKey]) { return null }
    return this.ioHandleRefs[ioKey].getPosition()
  }
}

export default Mod
