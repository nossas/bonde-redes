export const dicio: {
  360014379412: 'status_acolhimento'
  360016631592: 'nome_voluntaria'
  360016631632: 'link_match'
  360016681971: 'nome_msr'
  360017056851: 'data_inscricao_bonde'
  360017432652: 'data_encaminhamento'
  360021665652: 'status_inscricao'
  360021812712: 'telefone'
  360021879791: 'estado'
  360021879811: 'cidade'
} = {
  360014379412: 'status_acolhimento',
  360016631592: 'nome_voluntaria',
  360016631632: 'link_match',
  360016681971: 'nome_msr',
  360017056851: 'data_inscricao_bonde',
  360017432652: 'data_encaminhamento',
  360021665652: 'status_inscricao',
  360021812712: 'telefone',
  360021879791: 'estado',
  360021879811: 'cidade'
}

export type status_acolhimento_values = 'atendimento__concluído' | 'atendimento__iniciado' | 'atendimento__interrompido' | 'encaminhamento__aguardando_confirmação' | 'encaminhamento__confirmou_disponibilidade' | 'encaminhamento__negado' | 'encaminhamento__realizado' | 'encaminhamento__realizado_para_serviço_público' | 'solicitação_recebida'

export interface Ticket {
  id: number
  ticket_id: number
  assignee_id: number
  created_at: string
  custom_fields: Array<{
    id: keyof typeof dicio
    value: string | null
  } | { id: 360014379412; value: status_acolhimento_values }>
  description: string
  group_id: number
  organization_id: number
  raw_subject: string
  requester_id: number
  status: string
  subject: string
  submitter_id: number
  tags: string[]
  updated_at: string
  status_acolhimento: status_acolhimento_values | null
  nome_voluntaria: string | null
  link_match: string | null
  nome_msr: string | null
  data_inscricao_bonde: string | null
  data_encaminhamento: string | null
  status_inscricao: string | null
  telefone: string | null
  estado: string | null
  cidade: string | null
  community_id: number
  webhooks_registry_id: number | null
}

export const handleCustomFields = (ticket: Ticket) => {
  ticket.custom_fields.forEach(i => {
    if (dicio[i.id]) {
      if (i.id === 360014379412) {
        ticket[dicio[i.id]] = i.value as status_acolhimento_values
      } else {
        ticket[dicio[i.id]] = i.value
      }
    }
  })

  const {id, ...otherFields} = ticket
  const finalTicket = {
    ticket_id: id,
    ...otherFields,
    community_id: Number(process.env.COMMUNITY_ID)
  } as Ticket

  return finalTicket
}
