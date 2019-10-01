type condition = 'inscrita' | 
'disponivel' | 
'indisponível_férias' | 
'indisponível_maternidade' | 
'indisponível_agenda' | 
'indisponível_-sem_resposta' | 
'dados_incompletos_endereço' | 
'dados_incompletos_telefone' |
'dados_incompletos_email' |
'desabilitada' |
'descadastrada' |
'reprovada_estudo_de_caso' |
'reprovada_diretrizes_do_mapa' |
'reprovada_registro_inválido' |
'aprovada' |
'anti-etica'

type disponibilidade_de_atendimentos = '1' |
'2' |
'3' |
'4' |
'5_ou_mais' |
'0' |
'5'

interface User {
  active: boolean
  address: string
  alias: string
  atendimentos_concludos_calculado_: number
  atendimentos_concluidos: number
  atendimentos_em_andamento: number
  atendimentos_em_andamento_calculado_: number
  cep: string
  chat_only: boolean
  city: string
  condition: condition
  cor: string
  created_at: string
  custom_role_id: number
  data_de_inscricao_no_bonde: string
  default_group_id: number
  details: string
  disponibilidade_de_atendimentos: disponibilidade_de_atendimentos
  email: string
  encaminhamentos: number
  encaminhamentos_realizados_calculado_: number
  external_id: number
  iana_time_zone: string
  id: number
  last_login_at: string
  latitude: string
  locale: string
  locale_id: number
  longitude: string
  moderator: boolean
  name: string
  notes: string
  occupation_area: string
  only_private_comments: boolean
  organization_id: number
  phone: string
  photo: any
  registration_number: string
  report_csv: boolean
  restricted_agent: boolean
  role: string
  role_type: number
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
  user_id: number
  verified: boolean
  whatsapp: string
}

export const handleUserFields = (user: User) => {
  const {user_fields, ...otherFields} = user
  return {
    user_fields,
    ...otherFields,
    ...user_fields,
  }
}

export default User
