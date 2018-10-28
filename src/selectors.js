import _ from 'lodash'
import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'

import { orm } from './orm.js'

const ormSelector = state => state.orm

const programSelector = createSelector(
  ormSelector,
  ormCreateSelector(orm, (session) => {
    const programModel = session.Program.first()
    const program = {
      ...programModel.ref,
      mods: _.keyBy(programModel.modSet.toRefArray(), 'id'),
      wires: _.keyBy(programModel.wireSet.toRefArray(), 'id')
    }
    return program
  })
)

export default {
  program: programSelector,
}
