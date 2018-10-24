import React from 'react'
import { connect } from 'react-redux'

import Program from './Program'


class App extends React.Component {
  _setState (updates) {
    this.props.dispatch({type: 'setAppState', payload: updates})
  }

  render () {
    return (
      <div>
        <Program program={this.props.currentProgram} />
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return state.app || {}
}

export default connect(mapStateToProps)(App)
