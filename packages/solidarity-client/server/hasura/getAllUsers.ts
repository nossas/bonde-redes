import axios from 'axios'

const query = `query {
  solidarity_users(
    where: {
      longitude: {_is_null: false}, 
      latitude: {_is_null: false},
      organization_id: {_is_null: false}
    }
  ) {
    address
    organization_id
    user_id
    atendimentos_concludos_calculado_
    atendimentos_em_andamento_calculado_
    disponibilidade_de_atendimentos
    latitude
    longitude
    email
    encaminhamentos
    encaminhamentos_realizados_calculado_
    name
    phone
    registration_number
    occupation_area
    whatsapp
    data_de_inscricao_no_bonde
    condition
    tipo_de_acolhimento
  }
}`

const getAllUsers = async (
  // organization_id, condition
  ) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env
  const response = await axios.post(HASURA_API_URL || '', {
    query,
    // variables: {
    //   organization_id, condition
    // }
  }, {
    headers: {
      'x-hasura-admin-secret': X_HASURA_ADMIN_SECRET || ''
    }
  })

  try {
    return response.data.data.solidarity_users
  } catch (e) {
    console.log(response.data.errors[0])
    return null
  }
}

export default getAllUsers
