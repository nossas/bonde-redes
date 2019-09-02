import debug, { Debugger } from 'debug'
import axios from 'axios'
import { parse } from 'url';

const query = `{
  webhooks_registry(
    where: {
      service_name: {
        _eq: "mautic-form"
      }
    }
  ) {
    id
    data
  }
}`

const mutation = `mutation ($id: Int!, $data: jsonb!) {
  update_webhooks_registry(where: {id: {_eq: $id}}, _set: {data: $data}) {
    affected_rows
    returning {
      id
      data
    }
  }
}`

type Row = {id: number, data: string}

interface DataType {
  data: {
    update_webhooks_registry: {
      returning: Array<{
        id: number
      }>
    }
  }
}

interface DataTypeRows {
  data: {
    webhooks_registry: Row[]
  }
}

class Server {
  private dbg: Debugger

  constructor () {
    this.dbg = debug(`webhooks-convert`)
  }

  private getRows = async () => {
    const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
    try {
      const { data: { data: {webhooks_registry: rows} } } = await axios.post<DataTypeRows>(HASURA_API_URL, {
        query,
      }, {
        headers: {
          'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
        }
      })
      return rows
    } catch (e) {
      this.dbg(e)
    }
  }

  private updateRow = async ({id, data}: Row) => {
    const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
    try {
      const { data: { data: { update_webhooks_registry: { returning: [{ id: returnedId }] } } } } = await axios.post<DataType>(HASURA_API_URL, {
        query: mutation,
        variables: {
          id,
          data
        }
      }, {
        headers: {
          'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
        }
      })
      this.dbg(returnedId)
    } catch (e) {
      this.dbg(e)
    }
  }

  private updateRows = async (parsedRows: Row[]) => {
    parsedRows.forEach(async i => {
      await this.updateRow(i)
    })
  }

  start = async () => {
    const rows = await this.getRows()
    if (!rows) {
      return
    }
    const parsedRows = rows.map(({id, data}) => {
      try {
        const parsedData = JSON.parse(data)
        return {
          id,
          data: parsedData
        }
      } catch(e) {
        return {
          id, data
        }
      }
    })

    this.updateRows(parsedRows)
  }
}

export default Server
