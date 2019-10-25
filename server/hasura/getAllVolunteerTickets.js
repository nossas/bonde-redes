import axios from 'axios'

const query = `query ($organization_id: bigint, $status_inscricao: [String!]) {
  solidarity_tickets(where: {status_inscricao: {_in: $status_inscricao}, organization_id: {_eq: $organization_id}}) {
    requester_id
    status_inscricao
    ticket_id
  }
}`

const getAllTickets = async (organization_id, status_inscricao) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL, {
    query,
    variables: {
      organization_id,
      status_inscricao
    }
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  try {
    return response.data.data.solidarity_tickets
  } catch (e) {
    console.log(response)
    return null
  }
}

export default getAllTickets
