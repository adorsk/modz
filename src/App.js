import React from 'react'
import { connect } from 'react-redux'


class App extends React.Component {
  _setState (updates) {
    this.props.dispatch({type: 'setAppState', payload: updates})
  }

  render() {
    return (
      <div>
        <input
          value={this.props.someProp}
          onChange={(e) => this._setState({someProp: e.target.value})}
        />
        <div>someProp: {this.props.someProp}</div>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return state.app || {}
}

export default connect(mapStateToProps)(App)
