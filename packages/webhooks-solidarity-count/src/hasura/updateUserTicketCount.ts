import axios from 'axios'
import dbg from './dbg'
import User from '../interfaces/User'
import { HasuraResponse, isError } from '../interfaces/HasuraResponse'
import generateRequestVariables from './generateRequestVariables'
import HasuraBase from './HasuraBase'

const log = dbg.extend('saveUsers')

const generateVariablesIndex = (index: number) => `
$atendimentos_concludos_calculado__${index}: bigint!
$atendimentos_em_andamento_calculado__${index}: bigint!
$encaminhamentos_realizados_calculado__${index}: bigint!
$user_id_${index}: bigint!
`

const generateObjectsIndex = (index: number) => `
atendimentos_concludos_calculado_: $atendimentos_concludos_calculado__${index}
atendimentos_em_andamento_calculado_: $atendimentos_em_andamento_calculado__${index}
encaminhamentos_realizados_calculado_: $encaminhamentos_realizados_calculado__${index}
user_id: $user_id_${index}
`

const generateVariables = (tickets: User[]) => tickets.map(
  (_, index) => generateVariablesIndex(index),
).flat()

const generateObjects = (tickets: User[]) => `[${tickets.map((_, index) => `{${generateObjectsIndex(index)}}`).join(',')}]`

const createQuery = (users: User[]) => `mutation (${generateVariables(users)}) {
  insert_solidarity_users (objects: ${generateObjects(users)}, on_conflict: {
    constraint: solidarity_users_user_id_key
    update_columns: [
      atendimentos_concludos_calculado_
      atendimentos_em_andamento_calculado_
      encaminhamentos_realizados_calculado_
    ]
  }) {
    affected_rows
  }
}
`

interface Response {
  affected_rows: number
}

const updateUserTicketCount = async (users: User[]) => {
  const query = createQuery(users)
  const variables = generateRequestVariables(users)
  const response = await HasuraBase<HasuraResponse<'insert_solidarity_users', Response>>(HASURA_API_URL, {
    query,
    variables,
  })

  if (isError(response.data)) {
    return log(response.data.errors)
  }

  return response.data.data.insert_solidarity_users.affected_rows === 1
}

export default updateUserTicketCount
