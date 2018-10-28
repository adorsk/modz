import { ORM, Model, fk } from 'redux-orm'

import { actionTypes } from './actionTypes.js'

export class Program extends Model {
  static reducer (action, Program) {
    const { payload, type } = action
    switch (type) {
      case actionTypes.program.create:
        Program.create(payload)
        break
      default:
        break
    }
  }
}
Program.modelName = 'Program'

export class Mod extends Model {
  static reducer (action, Mod) {
    const { payload, type } = action
    switch (type) {
      case actionTypes.mod.create:
        Mod.create(payload)
        break
      case actionTypes.mod.update:
        const { id, updates } = payload
        Mod.withId(id).update(updates)
        break
      default:
        break
    }
  }
}
Mod.modelName = 'Mod'
Mod.fields = {
  program: fk('Program'),
}

export class Wire extends Model {
  static reducer (action, Wire) {
    const { payload, type } = action
    switch (type) {
      case actionTypes.wire.create:
        Wire.create(payload)
        break
      default:
        break
    }
  }
}
Wire.modelName = 'Wire'
Wire.fields = {
  program: fk('Program')
}

export const orm = new ORM()
orm.register(Mod, Wire, Program)

export default orm
