import Express from 'express'
import debug, { Debugger } from 'debug'
import ListTickets from './integrations/ListTickets';
import saveTicket from './saveTickets';
import countTickets, { TicketIds } from './countTickets';

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

type status_acolhimento_values = 'atendimento__concluído' | 'atendimento__iniciado' | 'atendimento__interrompido' | 'encaminhamento__aguardando_confirmação' | 'encaminhamento__confirmou_disponibilidade' | 'encaminhamento__negado' | 'encaminhamento__realizado' | 'encaminhamento__realizado_para_serviço_público' | 'solicitação_recebida'

export interface Ticket {
  id: number
  assignee_id: number
  created_at: string
  custom_fields: Array<{
    id: keyof typeof dicio
    value: string | null
  } | {id: 360014379412; value: status_acolhimento_values}>
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

const handleCustomFields = (ticket: Ticket) => {
  ticket.custom_fields.forEach(i => {
    if (dicio[i.id]) {
      if (i.id === 360014379412) {
        ticket[dicio[i.id]] = i.value as status_acolhimento_values
      } else {
        ticket[dicio[i.id]] = i.value
      }
    }
  })

  return ticket
}

class CLI {
  private server = Express().use(Express.json())

  private dbg: Debugger

  private formData?: FormData

  constructor () {
    this.dbg = debug(`webhooks-zendesk-ticket`)
  }

  saveTicket = async (ticket: Ticket) => {
    try {
      await saveTicket(ticket)
    } catch (e) {
      console.log('Falhou para o ticket ' + ticket.id)
      console.log('Tentando novamente em 1 segundo...')
      await new Promise(r => setTimeout(r, 1000))
      this.saveTicket(ticket)
    }
  }

  start = async () => {
    let tickets: Ticket[] = [];
    let actualPageNumber = '1'
    while (true) {
      const listTickets = new ListTickets()
      const actualPageTickets = await listTickets.start(actualPageNumber)
      if (actualPageTickets) {
        tickets = [...tickets, ...actualPageTickets.data.tickets]
        if (actualPageTickets.data.next_page) {
          console.log(`[${Number(actualPageNumber)*100}/${actualPageTickets.data.count}]`)
          actualPageNumber = (~~actualPageNumber + 1).toString()
        } else {
          console.log(`[${Number(actualPageTickets && actualPageTickets.data.count)}/${actualPageTickets && actualPageTickets.data.count}]`)
          break
        }
      } else {
        // Posteriormente fazer tratamento para tentar a requisição novamente
      }
    }

    // Convert tickets to have custom_fields on root:
    const { COMMUNITY_ID } = process.env
    const ticketsWithCustomFields = tickets.map(i => ({
      ...handleCustomFields(i),
      community_id: Number(COMMUNITY_ID)
    }))

    // Faz a contagem dos custom_fields, adiciona às relações ao banco e faz a contagem de tickets para cada ticket
    const ticketIds: TicketIds = {}
    ticketsWithCustomFields.forEach(i => {
      ticketIds[i.id] = i
    })
    await countTickets(ticketsWithCustomFields, ticketIds)

    // console.log('Script finalizado!')

    // Salva os tickets com custom_fields no banco
    await Promise.all(ticketsWithCustomFields.map(i => {
      return this.saveTicket(i)
    }))

    console.log('Script finalizado!')
  }
}

export default CLI
