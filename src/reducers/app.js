const initialState = {
  currentProgram: {
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
        inputs: {},
        outputs: {
          'output.1': {
            key: 'output.1',
            position: 0,
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
          'input.1': {
            key: 'input.1',
            position: 0,
          }
        },
        outputs: {},
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
  },
}

const reducer = (state = initialState, action) => {
  if (action.type === 'setAppState') {
    state = {...state, ...action.payload}
  }
  return state
}

export default reducer
