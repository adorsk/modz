export function generateInitialOrmState ({orm}) {
  const ormState = orm.getEmptyState()
  const session = orm.mutableSession(ormState)
  const { Program, Mod, Wire } = session
  const program = Program.create({
    id: 'myProgram',
  })
  const mods = {}
  mods['mod.1'] = Mod.create({
    id: 'mod.1',
    program,
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
        'outputs.1': {
          id: 'outputs.1',
          position: 0,
        }
      }
    },
  })
  mods['mod.2'] = Mod.create({
    id: 'mod.2',
    program,
    label: 'mod.2.label',
    position: {
      x: 300,
      y: 55,
    },
    dimensions: {
      width: 150,
      height: 200,
    },
    inputs: {
      values: {},
      handles: {
        'inputs.1': {
          id: 'inputs.1',
          position: 0,
        },
        'inputs.2': {
          id: 'inputs.2',
          position: 1,
        },
        'inputs.3': {
          id: 'inputs.3',
          position: 2,
        },
      }
    },
    outputs: {
      values: {},
      handles: {},
    },
  })

  Wire.create({
    id: 'mod.1::mod.2',
    program,
    src: {
      modId: 'mod.1',
      ioType: 'outputs',
      ioId: 'outputs.1',
    },
    dest: {
      modId: 'mod.2',
      ioType: 'inputs',
      ioId: 'inputs.1',
    }
  })

  return ormState
}
