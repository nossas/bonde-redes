import debug from 'debug'

interface ClientOptions {
  endpoint: string
}

class Client {
  private opts: ClientOptions

  protected dbg: debug.Debugger

  constructor (opts: ClientOptions, name: string) {
    this.opts = opts
    this.dbg = debug(`Client ${name}`)
  }
}

export default Client
