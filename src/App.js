import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Program from './Program'


class App extends React.Component {
  _setState (updates) {
    this.props.dispatch({type: 'setAppState', payload: updates})
  }

  render () {
    return (
      <div>
        <Program
          program={this.props.currentProgram}
          setModOutputValues={this.setModOutputValues.bind(this)}
          setModInputValues={this.setModInputValues.bind(this)}
        />
      </div>
    )
  }

  setModOutputValues ({modKey, outputValues}) {
    this._updateMod({
      modKey,
      updates: {
        outputs: {
          ...this.props.currentProgram.mods[modKey].outputs,
          values: outputValues,
        }
      }
    })
  }

  setModInputValues ({modKey, inputValues}) {
    this._updateMod({
      modKey,
      updates: {
        inputs: {
          ...this.props.currentProgram.mods[modKey].inputs,
          values: inputValues,
        }
      }
    })
  }

  _updateMod ({modKey, updates}) {
    this._setState({
      currentProgram: {
        ...this.props.currentProgram,
        mods: {
          ...this.props.currentProgram.mods,
          [modKey]: {
            ...this.props.currentProgram.mods[modKey],
            ...updates
          }
        }
      }
    })
  }

  componentDidMount () {
    this.loadProgram()
  }

  loadProgram () {
    // @TODO: implement 4reelz!
    const loadProgramPromise = Promise.resolve({
      program: this._generateMockProgram()
    })
    loadProgramPromise.then(({program}) => {
      this._setState({currentProgram: program})
      // Basically update mod states as they are loaded.
      // @TODO: split out mod states from program state
      _.each(program.mods, (mod) => {
        this._updateMod({
          modKey: mod.key,
          updates: {status: 'IMPORTING'}
        })
        this.loadMod({mod}).then(({module}) => {
          this._updateMod({
            modKey: mod.key,
            updates: {
              module,
              status: 'IMPORTED',
            }})
        })
      })
    })
  }

  _generateMockProgram () {
    const mockProgram = {
      mods: {
        'mod.1': {
          key: 'mod.1',
          label: 'mod.1.label',
          position: {
            x: 50,
            y: 50,
          },
          dimensions: {
            width: 200,
            height: 200,
          },
          inputs: {
            values: {},
            handles: {},
          },
          outputs: {
            values: {},
            handles: {
              'output.1': {
                key: 'output.1',
                position: 0,
              }
            }
          },
        },
        'mod.2': {
          key: 'mod.2',
          label: 'mod.2.label',
          position: {
            x: 300,
            y: 300,
          },
          dimensions: {
            width: 150,
            height: 200,
          },
          inputs: {
            values: {},
            handles: {
              'input.1': {
                key: 'input.1',
                position: 0,
              }
            }
          },
          outputs: {
            values: {},
            handles: {},
          },
        },
      },
      wires: {
        'mod.1::mod.2': {
          key: 'mod.1::mod.2',
          src: {
            modKey: 'mod.1',
            ioType: 'output',
            ioKey: 'output.1',
          },
          dest: {
            modKey: 'mod.2',
            ioType: 'input',
            ioKey: 'input.1',
          }
        }
      },
    }
    return mockProgram
  }

  loadMod ({mod}) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const module = {
          factory: () => {
            class MyMod {
              constructor () {
                this.counter = 0
              }
              renderInto ({parentNode}) {
                this.parentNode = parentNode
                this.parentNode.innerHTML = "initialized!"
              }

              run ({inputValues}) {
                const result = {
                  counter: this.counter++,
                  inputValues,
                }
                this.parentNode.innerHTML = `RESULT<br>${JSON.stringify(result)}`
                return {'output.1': this.counter}
              }
            }
            return new MyMod()
          },
        }
        resolve({module})
      }, 300)
    })
    return promise
  }

}


const mapStateToProps = (state, ownProps) => {
  return state.app || {}
}

export default connect(mapStateToProps)(App)
