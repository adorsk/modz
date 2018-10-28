import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import rootReducer from './reducers.js'
import { orm } from './orm.js'
import { generateInitialOrmState } from './bootstrap.js'

export default function configureStore(preloadedState) {
  const initialState = {
    orm: generateInitialOrmState({orm}),
    ...preloadedState,
  }
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, logger)
  )

  if(process.env.NODE_ENV !== "production") {
    if(module.hot) {
      module.hot.accept("./reducers.js", () =>{
        const newRootReducer = require("./reducers.js").default
        store.replaceReducer(newRootReducer)
      })
    }
  }
  return store
}
