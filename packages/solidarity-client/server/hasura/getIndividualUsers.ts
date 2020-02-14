import axios from 'axios'

const query = `query ($individual_id: bigint!){
  solidarity_users(
    where: {
      longitude: {_is_null: false},
      latitude: {_is_null: false},
      organization_id: {_eq: $individual_id}
    }
  )
  {
    organization_id
    user_id
    latitude
    longitude
    email
    name
    phone
    data_de_inscricao_no_bonde
    tipo_de_acolhimento
    address
  }
}`

const getIndividualUsers = async (individual_id) => {
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

export default getIndividualUsers
