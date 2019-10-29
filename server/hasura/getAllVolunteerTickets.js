import axios from 'axios'

const query = `query ($organization_id: bigint) {
  solidarity_tickets(where: {organization_id: {_eq: $organization_id}}) {
    requester_id
    status_inscricao
    ticket_id
  }
}`

const getAllTickets = async (organization_id) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL, {
    query,
    variables: {
      organization_id
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
