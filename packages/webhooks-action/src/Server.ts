import Express from 'express'
import debug, { Debugger } from 'debug'

class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  constructor () {
    this.dbg = debug(`webhooks-action`)
  }

  private pressure = async (req: any, res: any) => {
    res
      .status(200)
      .json({ 'hello': 'TODO: Pressure Action' })
  }

  start = () => {
    const { PORT } = process.env
    this.server
      .get('/pressure', this.pressure.bind(this))
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Webhook Auth Server listen on port ${PORT}`)
      })
  }
}

export default Server
