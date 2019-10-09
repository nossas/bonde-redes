import { isError, HasuraResponse } from "../interfaces/HasuraResponse"
import axios from 'axios'
import dbg from "./dbg"
import verifyOrganization from "../app/verifyOrganizations"
import { UserFromTicket } from "./getUserFromTicket"

const query = `
query {
  solidarity_users(where: {
    latitude: {
      _is_null: false
    }
    longitude: {
      _is_null: false
    }
  }) {
    user_id
    name
    atendimentos_concludos_calculado_
    atendimentos_em_andamento_calculado_
    encaminhamentos_realizados_calculado_
    disponibilidade_de_atendimentos
    latitude
    longitude
    condition
    tipo_de_acolhimento
    organization_id
  }
}
`

const log = dbg.extend('getAllUsersLocalizations')

const getAllUsersLocalizations = async () => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post<HasuraResponse<'solidarity_users', UserFromTicket[]>>(HASURA_API_URL, {
    query
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  if (isError(response.data)) {
    return log(response.data.errors)
  }

  return Promise.all(response.data.data.solidarity_users.map(async i => ({
    ...i,
    organization: await verifyOrganization(i.organization_id)
  })))
}

export default getAllUsersLocalizations
