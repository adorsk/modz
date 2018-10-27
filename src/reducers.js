import { combineReducers } from 'redux'
import { createReducer } from 'redux-orm'

import { orm } from './models.js'

const rootReducer = combineReducers({
  orm: createReducer(orm),
})

export default rootReducer
