import axios from 'axios'

const query = `query {
  solidarity_tickets {
    requester_id
    status_inscricao
    status_acolhimento
    ticket_id
    created_at
    status
    subject
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
    console.log(response.data.errors)
    return null
  }
}

export default getAllTickets
