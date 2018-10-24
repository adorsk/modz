import React from 'react'
import _ from 'lodash'

class Mod extends React.Component {
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
          {this.renderLabel()}
          {this.renderBody()}
        </div>
      </div>
    )
  }

  renderLabel () {
    const { mod } = this.props
    return (<label className='mod-name'>{mod.label}</label>)
  }

  renderBody () {
    return (
      <div className='mod-body'>
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
    return (
      <div className='input-handles'>
        {
          _.sortBy(this.props.mod.inputs, 'position')
            .map((ioDef) => {
              return this.renderInputHandle({ioDef})
            })
        }
      </div>
    )
  }

  renderInputHandle ({ioDef}) {
    return (
      <div key={ioDef.key}>{JSON.stringify(ioDef)}</div>
    )
  }

  renderOutputHandles () {
    return (
      <div className='output-handles'>
        {
          _.sortBy(this.props.mod.outputs, 'position')
            .map((ioDef) => {
              return this.renderOutputHandle({ioDef})
            })
        }
      </div>
    )
  }

  renderOutputHandle ({ioDef}) {
    return (
      <div key={ioDef.key}>{JSON.stringify(ioDef)}</div>
    )
  }

  renderModInterface () {
    return (
      <div className='mod-interface-container'>TK: Mod Interface</div>
    )
  }

  componentDidMount () {
    // call mod's setupInterface method.
    // init mod? (I think no...bc that's affecting program state)
  }
}

export default Mod
