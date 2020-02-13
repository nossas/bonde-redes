import axios from 'axios'

const query = `query ($individual_id: bigint!){
  solidarity_users(
    where: {
      condition: {_eq: "disponivel"},
      organization_id: {_neq: $individual_id },
      longitude: {_is_null: false},
      latitude: {_is_null: false},
    }
  ) {
    user_id,
    disponibilidade_de_atendimentos,
    atendimentos_em_andamento_calculado_,
    email,
    name,
    organization_id,
    latitude,
    longitude
  }
}`

const getVolunteersAvailability = async (individual_id) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL || '', {
    query,
    variables: {
      individual_id
    }
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
