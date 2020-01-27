import axios from 'axios'

const query = `query ($organization_id: bigint, $status_acolhimento: String) {
  solidarity_tickets(where: {status_acolhimento: {_eq: $status_acolhimento}, organization_id: {_eq: $organization_id}}) {
    requester_id
    status_acolhimento
    ticket_id
    subject
    created_at
    status
  }
}`

const getAllTickets = async (organization_id, status_acolhimento) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL || '', {
    query,
    variables: {
      organization_id,
      status_acolhimento
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
