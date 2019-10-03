import axios from 'axios'
import dbg from './dbg'
import User from '../interfaces/User'
import { HasuraError } from '../interfaces/HasuraError'

const log = dbg.extend('getUserFromTicket')

const query = `query ($id: bigint) {
  solidarity_users(where: {
    user_id: {
      _eq: $id
    }
  }) {
    id
    atendimentos_concludos_calculado_
    atendimentos_em_andamento_calculado_
    encaminhamentos_realizados_calculado_
    disponibilidade_de_atendimentos
    condition
  }
}`

interface ResponseData {
  data: {
    solidarity_users: User[]
  }
}

const isError = (data: ResponseData | HasuraError): data is HasuraError => {
  if (data['error']) {
    return true
  } else {
    return false
  }
}

const getUserFromTicket = async (id: number) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post<ResponseData | HasuraError>(HASURA_API_URL, {
    query,
    variables: { id }
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  if (isError(response.data)) {
    log(response.data.errors)
    return null
  }

  return response.data.data.solidarity_users
}

export default getUserFromTicket
