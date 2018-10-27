import { actionTypes } from './actionTypes.js'

const actions = {}

actions.program = {
  create: ({props}) => ({
    type: actionTypes.program.create,
    payload: props,
  }),
}

actions.mod = {
  select: ({id}) => ({
    type: actionTypes.Mod,
    payload: {id},
  }),
  create: ({props}) => ({
    type: actionTypes.mod.create,
    payload: props,
  }),
  update: ({id, updates}) => ({
    type: actionTypes.mod.update,
    payload: {id, updates}
  }),
  loadModule: ({id}) => {
    const _load = () => {
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
                  this.parentNode.innerHTML = 'initialized!'
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

    const thunk = (dispatch) => {
      dispatch(actions.mod.update({
        id,
        updates: {importStatus: 'IMPORTING'}
      }))
      _load().then(({module}) => {
        dispatch(actions.mod.update({
          id,
          updates: {importStatus: 'IMPORTED', module}
        }))
      })
    }
    return thunk
  }
}

actions.wire = {
  create: ({props}) => ({
    type: actionTypes.wire.create,
    payload: props,
  })
}

export default actions
