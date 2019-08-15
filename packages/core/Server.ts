import Express from 'express'
import debug, { Debugger } from 'debug'
import axios from 'axios'

const mutation = (HASURA_TABLE_NAME: string) => `mutation(
  $json: jsonb!,
  $service_name: String!
) {
  logTable: insert_${HASURA_TABLE_NAME} (
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

  private name: string

  private dbg: Debugger

  constructor (name: string) {
    this.name = name
    this.dbg = debug(`microservice:webserver:${name}`)
  }

  private request = async (data: any) => {
    const { HASURA_API_URL, HASURA_TABLE_NAME } = process.env
    try {
      const json = JSON.stringify(data)
      const { data: { data: { logTable: { returning: [{ id }] } } } } = await axios.post<DataType>(HASURA_API_URL, {
        query: mutation(HASURA_TABLE_NAME),
        variables: { json, service_name: this.name }
      })
      this.dbg(`Success logged, id: ${id}`)
    } catch (e) {
      this.dbg(e)
    }
  }

  logTo = () => {
    this.server.post('/', (req: Request) => {
      this.request(req.body)
    })
  }

  listen = () => {
    const { PORT } = process.env
    return new Promise((resolve, reject) => {
      this.server.listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Server listen on port ${PORT}`)
        resolve()
      })
    })
  }
}

export default Server
