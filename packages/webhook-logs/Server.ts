import Express from 'express'
import debug, { Debugger } from 'debug'
import axios from 'axios'

const mutation = `mutation(
  $json: jsonb!,
  $service_name: String!
) {
  logTable: insert_webhook_logs (
    objects: {
      data: $json,
      service_name: $service_name
    }
  ) {
    returning { id }
  }
}`

interface DataType {
  data: {
    logTable: {
      returning: Array<{
        id: number
      }>
    }
  }
}

class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  constructor () {
    this.dbg = debug(`webhook-logs`)
  }

  private request = async (serviceName: string, data: any) => {
    const { HASURA_API_URL } = process.env
    try {
      const json = JSON.stringify(data)
      const { data: { data: { logTable: { returning: [{ id }] } } } } = await axios.post<DataType>(HASURA_API_URL, {
        query: mutation,
        variables: { json, service_name: serviceName }
      })
      this.dbg(`Success logged "${serviceName}" req with id "${id}"`)
    } catch (e) {
      this.dbg(e)
    }
  }

  start = () => {
    const { PORT } = process.env
    this.server
      .post('/:serviceName', async (req, res) => {
        const { serviceName } = req.params as {[s: string]: string}
        if (!serviceName) {
          return res.status(400).json('O caminho "/" do bonde-webhook-logs não deve ser acessado. Favor acessar o caminho "/<nome do serviço que está acessando>" para que ele funcione.')
        }
        await this.request(serviceName, req.body)
        res.status(200).json('OK!')
      })
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Server listen on port ${PORT}`)
      })
  }
}

export default Server
