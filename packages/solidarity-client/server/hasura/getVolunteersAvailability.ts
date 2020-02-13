import axios from 'axios'

const query = `query {
  solidarity_users(
    where: {
      condition: {_eq: "disponivel"}
    }
  ) {
    user_id,
    disponibilidade_de_atendimentos,
    atendimentos_em_andamento_calculado_,
    email,
    name,
    organization_id
  }
}`

const getVolunteersAvailability = async () => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL || '', {
    query,
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET
    }
  })

  try {
    return response.data.data.solidarity_users
  } catch (e) {
    console.log(response.data.errors)
    return null
  }
}

export default getVolunteersAvailability
