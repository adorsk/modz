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
    if (type === actionTypes.mod.create) {
        Mod.create(payload)
    } else if (type === actionTypes.mod.update) {
      const { id, updates } = payload
      Mod.withId(id).update(updates)
    } else if (type === actionTypes.mod.updateIoValues) {
      const { id, ioType, updates } = payload
      const mod = Mod.withId(id)
      const ioShard = mod.ref[ioType]
      const patch = {
        [ioType]: {
          ...ioShard,
          values: {
            ...ioShard.values,
            ...updates
          }
        }
      }
      mod.update(patch)
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
        const { program, src, dest } = payload
        const _getIoId = (io) => [io.modId, io.ioType, io.ioId].join(':')
        const id = [_getIoId(src), _getIoId(dest)].join('::')

        Wire.create({id, program: program.id, src, dest})
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
