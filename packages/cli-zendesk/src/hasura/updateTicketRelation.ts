import axios from 'axios'

const mutation = `mutation(
  $id: Int
  $webhooks_registry_id: Int
) {
  update_solidarity_tickets(
    where: {
      id: {
        _eq: $id
      }
    }
    _set: {
      webhooks_registry_id: $webhooks_registry_id
    }
  ) {
    affected_rows
  }
}
`

const updateTicketRelation = async (id: number, webhooks_registry_id: number) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL, {
    query: mutation,
    variables: {
      id,
      webhooks_registry_id
    }
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  return response
}

export default updateTicketRelation
