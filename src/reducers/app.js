const initialState = {
  someProp: 1,
}

const reducer = (state = initialState, action) => {
  if (action.type === 'setAppState') {
    state = {...state, ...action.payload}
  }
  return state
}

export default reducer
