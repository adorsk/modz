import React from 'react'


class IoHandle extends React.Component {
  constructor (props) {
    super(props)
    this.handleRef = React.createRef()
  }

  render () {
    const { handleDef, ioType, value } = this.props
    const icon = (ioType === 'input') ? '▶' : '◀'
    return (
      <div>
        <span ref={this.handleRef}>
          {icon}
        </span>
        <div>
          def: {JSON.stringify(handleDef)}
        </div>
        <div>
          value: {JSON.stringify(value)}
        </div>
      </div>
    )
  }

  componentDidMount () {
    if (this.props.afterMount) { this.props.afterMount(this) }
  }

  componentWillUnmount () {
    if (this.props.beforeUnmount) { this.props.beforeUnmount(this) }
  }

  getPosition () {
    const boundingRect = this.handleRef.current.getBoundingClientRect()
    return {
      x: boundingRect.left + window.pageXOffset,
      y: boundingRect.top + window.pageYOffset,
    }
  }
}

export default IoHandle
