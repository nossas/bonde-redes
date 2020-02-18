import axios from 'axios'

const getSolidarityTickets = async ({ query, variables = {} }) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL || '', {
    query,
    variables
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

export default getSolidarityTickets
