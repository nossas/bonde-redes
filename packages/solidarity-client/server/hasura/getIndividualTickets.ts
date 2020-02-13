import axios from 'axios'

const query = `query {
  solidarity_tickets(
   where: {
     _or: [
       {status: {_eq: "open"}},
       {status: {_eq: "new"}}
     ],
     status_acolhimento: {_eq: "solicitação_recebida"},
     status: {_neq: "deleted"}
   }
 ) {
   status_acolhimento
   status
   subject
   ticket_id
   requester_id
   created_at
 }
}`

const getIndividualTickets = async () => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL || '', {
    query,
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

export default getIndividualTickets
