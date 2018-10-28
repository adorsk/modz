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
          <label className='mod-name'>{mod.label}</label>
          <div key="body" className='mod-body'>
            {this.renderActionButtons()}
            <div>
              {this.renderInputHandles()}
              {
                (mod.importStatus === 'IMPORTED')
                  ? this.renderModInterface()
                  : `importStatus: ${mod.importStatus}`
              }
              {this.renderOutputHandles()}
            </div>
          </div>
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
                value: ioDefs.values[handleDef.id],
              })
            })
        }
      </div>
    )
  }

  renderIoHandle ({handleDef, ioType, value}) {
    return (
      <IoHandle
        key={handleDef.id}
        handleDef={handleDef}
        value={value}
        ioType={ioType}
        afterMount={(el) => {
          this.ioHandleRefs[handleDef.id] = el
        }}
        beforeUnmount={(el) => {
          delete this.ioHandleRefs[handleDef.id]
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
    const { mod } = this.props
    if (mod) {
      if (mod.importStatus !== 'IMPORTED') {
        this.props.loadModule({id: mod.id})
      }
    }
    if (this.props.afterMount) { this.props.afterMount(this) }
  }

  componentDidUpdate (prevProps) {
    const didImport = (
      (prevProps.mod.importStatus === 'IMPORTING')
      && (this.props.mod.importStatus === 'IMPORTED')
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

  getIoHandlePosition ({ioType, ioId}) {
    if (! this.ioHandleRefs[ioId]) { return null }
    return this.ioHandleRefs[ioId].getPosition()
  }
}

export default Mod
