import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers.js'
import { orm } from './orm.js'
import { generateInitialOrmState } from './bootstrap.js'

export default function configureStore(preloadedState) {
  const initialState = {
    orm: generateInitialOrmState({orm}),
    ...preloadedState,
  }

  const composeEnhancers = (
    (
      (typeof window === 'object') &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    )
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    })
    : compose
  )

  const enhancer = composeEnhancers(applyMiddleware(thunk))
  const store = createStore(rootReducer, initialState, enhancer)

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
