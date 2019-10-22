import debug, { Debugger } from 'debug'
import dotenv from 'dotenv'
import Express from 'express'
import Mail from './Mail'
import { delivery } from './actions'

dotenv.config()


class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  constructor () {
    this.dbg = debug(`webhook-mail`)
    // Routing
    this.server.get('/health', this.health.bind(this))
    this.server.post('/webhook', this.webhook.bind(this))
  }

  private health = async (_, res: any) => {
    res
      .status(200)
      .json({
        'service': 'webhook-mail',
        'status': 'Running'
      })
  }

  private webhook = async (req: any, res: any) => {
    const notifyMail = req.body.event.data.new
    const mail = new Mail({
      from: notifyMail.email_from,
      to: notifyMail.email_to,
      subject: notifyMail.subject,
      body: notifyMail.body,
      vars: notifyMail.context
    })

    const resp = await mail.send()

    if (resp.rejected.length === 0) {
      const result = await delivery(notifyMail.id)
      const { data: { update_notify_mail: {
        returning: delivered
      }}} = result

      res.status(200).json({
        message: resp.messageId,
        mail: delivered.id,
        delivered_at: delivered.delivered_at
      })
    } else {
      res.status(400).json({ mode: 'testing' })
    }
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
