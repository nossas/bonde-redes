import Express from 'express'
import debug, { Debugger } from 'debug'
import axios from 'axios'

const mutation = `mutation(
  $json: jsonb!,
  $service_name: String!
) {
  logTable: insert_webhooks_registry (
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
      returning: {
        id: number
      }[]
    }
  }
}

class Server {
  server = Express().use(Express.json())

  private dbg: Debugger

  constructor () {
    this.dbg = debug(`webhooks-registry`)
  }

  private request = async (serviceName: string, json: object) => {
    const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
    try {
      const { data: { data: { logTable: { returning: [{ id }] } } } } = await axios.post<DataType>(HASURA_API_URL, {
        query: mutation,
        variables: { json, service_name: serviceName }
      }, {
        headers: {
          'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
        }
      })
      this.dbg(`Success logged "${serviceName}" req with id "${id}"`)
    } catch (e) {
      this.dbg(e)
    }
  }

  start = () => {
    this.server
      .post('/:serviceName', async (req, res) => {
        const { serviceName } = req.params as {[s: string]: string}
        this.dbg(`Incomming request from "${serviceName}"`)
        if (!serviceName) {
          return res.status(400).json('O caminho "/" do bonde-webhooks-registry não deve ser acessado. Favor acessar o caminho "/<nome do serviço que está acessando>" para que ele funcione.')
        }
        await this.request(serviceName, req.body)
        res.status(200).json('OK!')
      })
  }

  listen = () => {
    const { PORT } = process.env
    this.server
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Server listen on port ${PORT}`)
      })
  }
}

export default Server
