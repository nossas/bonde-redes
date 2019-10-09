import axios from 'axios'
import { HasuraResponse, isError } from '../interfaces/HasuraResponse'
import dbg from './dbg'
import { Match } from '../interfaces/Match'

const query = `
query($id: bigint, $created_at: timestamp) {
  solidarity_matches(where: {
    volunteers_user_id: {
      _eq: $id
    },
    created_at: {
      _lt: $created_at
    },
    status: {
      _eq: "encaminhamento__realizado"
    }
  }) {
    id
    status
    community_id
    created_at
    individuals_ticket_id
    individuals_user_id
    volunteers_ticket_id
    volunteers_user_id
  }
}
`

const log = dbg.extend('getRecentMatches')

const getRecentMatches = async (id: number) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post<HasuraResponse<'solidarity_matches', Match[]>>(HASURA_API_URL, {
    query,
    variables: { id }
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  if (isError(response.data)) {
    return log(response.data.errors)
  }

  return response.data.data.solidarity_matches
}

export default getRecentMatches
