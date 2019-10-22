import debug, { Debugger } from 'debug'
import dotenv from 'dotenv'
import Express from 'express'
import { detailPressure, sendMail } from './actions'

dotenv.config()


class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  constructor () {
    this.dbg = debug(`webhook-activists`)
    // Routing
    this.server.get('/health', this.health.bind(this))
    this.server.post('/webhook/pressure', this.pressure.bind(this))
  }

  private health = async (_, res: any) => {
    res
      .status(200)
      .json({
        'service': 'webhook-activists',
        'status': 'Running'
      })
  }

  private pressure = async (req: any, res: any) => {
    const notifyPressure = req.body.event.data.new
    const pressure = await detailPressure({ id: notifyPressure.id })

    // First send pressure mails
    const mails = pressure.widget.settings.targets.split(';').map(target => {
      return {
        email_from: pressure.activist.email,
        email_to: target,
        subject: pressure.widget.settings.pressure_subject,
        body: pressure.widget.settings.pressure_body
      }
    })

    const result = await sendMail(mails)
    res.status(200)
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
