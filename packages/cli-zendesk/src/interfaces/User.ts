interface User {
  active: boolean
  address: string
  alias: string
  atendimentos_concludos_calculado_: bigint
  atendimentos_concluidos: bigint
  atendimentos_em_andamento: bigint
  atendimentos_em_andamento_calculado_: bigint
  cep: string
  chat_only: boolean
  city: string
  condition: string
  cor: string
  created_at: string
  custom_role_id: bigint
  data_de_inscricao_no_bonde: string | null
  default_group_id: bigint
  details: string
  disponibilidade_de_atendimentos: string
  email: string
  encaminhamentos: bigint
  encaminhamentos_realizados_calculado_: bigint
  external_id: bigint
  iana_time_zone: string
  id: number
  last_login_at: string
  latitude: string
  locale: string
  locale_id: bigint
  longitude: string
  moderator: boolean
  name: string
  notes: string
  occupation_area: string
  only_private_comments: boolean
  organization_id: bigint
  phone: string
  photo: any
  registration_number: string
  report_csv: boolean
  restricted_agent: boolean
  role: string
  role_type: bigint
  shared: boolean
  shared_agent: boolean
  shared_phone_number: string
  signature: string
  state: string
  suspended: boolean
  tags: any
  ticket_restriction: string
  time_zone: string
  tipo_de_acolhimento: string
  two_factor_auth_enabled: boolean
  ultima_atualizacao_de_dados: string
  updated_at: string
  url: string
  user_fields: any
  user_id: bigint
  verified: boolean
  whatsapp: string
}

export const handleUserFields = (user: User) => {
  const { user_fields, ...otherFields } = user
  return {
    user_fields,
    ...otherFields,
    ...user_fields,
  }
}

export default User
