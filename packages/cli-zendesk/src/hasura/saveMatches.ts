import axios from 'axios'
import dbg from './dbg'
import { stringifyVariables } from '../stringify'
import { Match } from '../interfaces/Match'

const generateVariablesIndex = (index: number) => `
$community_id_${index}: Int
$created_at_${index}: timestamp
$individuals_ticket_id_${index}: bigint
$individuals_user_id_${index}: bigint
$volunteers_ticket_id_${index}: bigint
$volunteers_user_id_${index}: bigint
$status_${index}: String
`

const generateObjectsIndex = (index: number) => `
community_id: $community_id_${index}
created_at: $created_at_${index}
individuals_ticket_id: $individuals_ticket_id_${index}
individuals_user_id: $individuals_user_id_${index}
volunteers_ticket_id: $volunteers_ticket_id_${index}
volunteers_user_id: $volunteers_user_id_${index}
status: $status_${index}
`

const generateVariables = (matches: Match[]) => matches.map(
  (_, index) => generateVariablesIndex(index),
).flat()

const generateObjects = (matches: Match[]) => `[${matches.map((_, index) => `{${generateObjectsIndex(index)}}`).join(',')}]`

const createQuery = (matches: Match[]) => `mutation (${generateVariables(matches)}) {
  insert_solidarity_matches (objects: ${generateObjects(matches)}, on_conflict: {
    constraint: solidarity_matches_individuals_ticket_id_volunteers_ticket__key, update_columns: [
      community_id
      created_at
      individuals_user_id
      volunteers_user_id
      status
    ]}) {
      affected_rows
    }
  }
`

const saveMatches = async (matches: Match[]) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const query = createQuery(matches)
  const variables = stringifyVariables(matches)
  const response = await axios.post(HASURA_API_URL, {
    query,
    variables,
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET,
    },
  })

  response.data.errors && dbg(response.data.errors)

  return response
}

export default saveMatches
