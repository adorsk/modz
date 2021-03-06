import React from 'react'
import { connect } from 'react-redux'

import selectors from './selectors.js'
import actions from './actions.js'
import Program from './components/Program.js'


class App extends React.Component {
  _setState (updates) {
    this.props.dispatch({type: 'setAppState', payload: updates})
  }

  render () {
    return (
      <div>
        <Program
          program={this.props.program}
          updateMod={(...args) => {
            return this.props.dispatch(actions.mod.update(...args))
          }}
          loadModModule={(...args) => {
            return this.props.dispatch(actions.mod.loadModule(...args))
          }}
          addWire={(...args) => {
            return this.props.dispatch(actions.wire.create(...args))
          }}
          updateModIoValues={(...args) => {
            return this.props.dispatch(actions.mod.updateIoValues(...args))
          }}
        />
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    program: selectors.program(state),
  }
}

export default connect(mapStateToProps)(App)
