import debug, { Debugger } from 'debug'
import dotenv from 'dotenv'
import Express from 'express'

dotenv.config()


class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  constructor () {
    this.dbg = debug(`webhook-mail`)
    // Routing
    this.server.get('/health', this.health.bind(this))
  }

  private health = async (_, res: any) => {
    res
      .status(200)
      .json({
        'service': 'webhook-mail',
        'status': 'Running'
      })
  }

  start = () => {
    const { PORT } = process.env
    this.server.listen(Number(PORT), '0.0.0.0', () => {
      this.dbg(`server listen on port ${PORT}`)
    })
  }

  getInstance = () => {
    return this.server
  }
}

export default Server
