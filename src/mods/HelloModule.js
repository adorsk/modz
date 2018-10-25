class HelloModule {
  constructor (opts) {
  }

  init ({containerNode}) {
    console.log("cn: ", containerNode)
  }

  run () {
    console.log("Hello!")
  }
}

export default HelloModule
