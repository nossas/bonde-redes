import axios from 'axios'

const query = `query getPendingTickets($last_month: timestamp!){
  solidarity_matches(
    order_by: {created_at: desc}
    where: {
      created_at: {_gte: $last_month},
      status: {_eq: "encaminhamento__realizado"}
    }
  ) {
    volunteers_user_id,
    volunteers_ticket_id
  }
}`

const getPendingTickets = async (date) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL || '', {
    query,
    variables: {
      last_month: date
    }
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  try {
    return response.data.data.solidarity_matches
  } catch (e) {
    console.log(response.data.errors)
    return null
  }
}

export default getPendingTickets
