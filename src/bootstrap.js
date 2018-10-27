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
        'output.1': {
          id: 'output.1',
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
      y: 300,
    },
    dimensions: {
      width: 150,
      height: 200,
    },
    inputs: {
      values: {},
      handles: {
        'input.1': {
          id: 'input.1',
          position: 0,
        }
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
      ioType: 'output',
      ioId: 'output.1',
    },
    dest: {
      modId: 'mod.2',
      ioType: 'input',
      ioId: 'input.1',
    }
  })

  return ormState
}
