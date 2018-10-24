import React from 'react'

import Mod from './Mod.js'


class Program extends React.Component {
  render () {
    const { program } = this.props
    return (
      <div>
        <div
          className='program-container'
          style={{position: 'relative'}}
        >
          {this.renderMods({mods: program.mods})}
        </div>
      </div>
    )
  }

  renderMods ({mods}) {
    return (
      <div
        className='mods-container'
        style={{position: 'absolute'}}
      >
        {
          Object.keys(mods).map((modKey) => {
            return this.renderMod({mod: mods[modKey]})
          })
        }
      </div>
    )
  }

  renderMod ({mod}) {
    return (
      <Mod
        key={mod.key}
        mod={mod}
        style={{
          position: 'absolute',
          left: mod.position.x,
          top: mod.position.y,
        }}
      />
    )
  }
}

export default Program
