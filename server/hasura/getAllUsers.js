import axios from 'axios'

const query = `query ($organization_id: bigint) {
  solidarity_users(where: {organization_id: {_eq: $organization_id}}) {
    active
    address
    alias
    atendimentos_concludos_calculado_
    atendimentos_concluidos
    atendimentos_em_andamento
    atendimentos_em_andamento_calculado_
    cep
    chat_only
    city
    community_id
    condition
    cor
    created_at
    custom_role_id
    data_de_inscricao_no_bonde
    default_group_id
    details
    disponibilidade_de_atendimentos
    email
    encaminhamentos
    encaminhamentos_realizados_calculado_
    external_id
    iana_time_zone
    id
    last_login_at
    latitude
    locale
    locale_id
    longitude
    moderator
    name
    notes
    occupation_area
    only_private_comments
    organization_id
    permanently_deleted
    phone
    photo
    registration_number
    report_csv
    restricted_agent
    role
    role_type
    shared
    shared_agent
    shared_phone_number
    signature
    state
    suspended
    tags
    ticket_restriction
    time_zone
    tipo_de_acolhimento
    two_factor_auth_enabled
    ultima_atualizacao_de_dados
    updated_at
    url
    user_fields
    user_id
    verified
    whatsapp
  }
}
`

const getAllUsers = async (organization_id) => {
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
    return response.data.data.solidarity_users
  } catch (e) {
    console.log(response)
    return null
  }
}

export default getAllUsers
