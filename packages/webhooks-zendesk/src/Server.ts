import Express, { Response } from 'express'
import debug, { Debugger } from 'debug'
import AdvogadaCreateUser from './integrations/AdvogadaCreateUser'
import PsicologaCreateUser from './integrations/PsicologaCreateUser'
import ListTicketsFromUser from './integrations/ListTicket'
import AdvogadaCreateTicket from './integrations/AdvogadaCreateTicket'
import AdvogadaUpdateTicket from './integrations/AdvogadaUpdateTicket'
import PsicologaCreateTicket from './integrations/PsicologaCreateTicket'
import PsicologaUpdateTicket from './integrations/PsicologaUpdateTicket'
import { FILTER_SERVICE_STATUS, filterService } from './filterService'
import { FILTER_FORM_NAME_STATUS, filterFormName } from './filterFormName'
import BondeCreatedDate from './integrations/BondeCreatedDate'

interface DataType {
  data: {
    logTable: {
      returning: {
        id: number
      }[]
    }
  }
}

interface FormData {
  cep: string
}

class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  private formData?: FormData

  constructor() {
    this.dbg = debug('webhooks-zendesk')
  }

  dictionary: {[s: string]: string} = {
    aprovada: 'aprovada',
    reprovada_estudo_de_caso: 'reprovada_-_estudo_de_caso',
    reprovada_registro_inválido: 'reprovada_-_registro_inválido',
    reprovada_diretrizes_do_mapa: 'reprovada_-_diretrizes_do_mapa',
  }

  createTicket = async (instance: AdvogadaCreateUser | PsicologaCreateUser, {
    id,
    organization_id,
    name,
    phone,
    user_fields: {
      registration_number,
      condition,
      state,
      city,
    },
  }, created_at: string, res: Response) => {
    const listTickets = new ListTicketsFromUser(id, res)
    const tickets = await listTickets.start()
    if (!tickets) {
      return undefined
    }
    const filteredTickets = tickets.data.tickets.filter((i: any) => {
      if (instance instanceof AdvogadaCreateUser) {
        return ['open', 'new', 'pending', 'hold'].includes(i.status) && i.subject === `[Advogada] ${name} - ${registration_number}`
      }
      return ['open', 'new', 'pending', 'hold'].includes(i.status) && i.subject === `[Psicóloga] ${name} - ${registration_number}`
    })

    if (filteredTickets.length === 0) {
      if (instance instanceof AdvogadaCreateUser) {
        const advogadaCreateTicket = new AdvogadaCreateTicket(res)
        return advogadaCreateTicket.start<any>({
          requester_id: id,
          organization_id,
          description: '-',
          status_inscricao: 'aprovada',
          subject: `[Advogada] ${name} - ${registration_number}`,
          custom_fields: [{
            id: 360021665652,
            value: this.dictionary[condition],
          }, {
            id: 360016631592,
            value: name,
          }, {
            id: 360021812712,
            value: phone,
          }, {
            id: 360021879791,
            value: state,
          }, {
            id: 360021879811,
            value: city,
          }],
          created_at,
        })
      }
      const psicólogaCreateTicket = new PsicologaCreateTicket(res)
      return psicólogaCreateTicket.start<any>({
        requester_id: id,
        organization_id,
        description: '-',
        status_inscricao: 'aprovada',
        subject: `[Psicóloga] ${name} - ${registration_number}`,
        custom_fields: [{
          id: 360021665652,
          value: this.dictionary[condition],
        }, {
          id: 360016631592,
          value: name,
        }, {
          id: 360021812712,
          value: phone,
        }, {
          id: 360021879791,
          value: state,
        }, {
          id: 360021879811,
          value: city,
        }],
        created_at,
      })
    }
    if (instance instanceof AdvogadaCreateUser) {
      const advogadaUpdateTicket = new AdvogadaUpdateTicket(filteredTickets[0].id, res)
      return advogadaUpdateTicket.start<any>({
        requester_id: id,
        organization_id,
        description: '-',
        status_inscricao: 'aprovada',
        subject: `[Advogada] ${name} - ${registration_number}`,
        custom_fields: [{
          id: 360021665652,
          value: this.dictionary[condition],
        }, {
          id: 360016631592,
          value: name,
        }, {
          id: 360021812712,
          value: phone,
        }, {
          id: 360021879791,
          value: state,
        }, {
          id: 360021879811,
          value: city,
        }],
      })
    }
    const psicólogaUpdateTicket = new PsicologaUpdateTicket(filteredTickets[0].id, res)
    return psicólogaUpdateTicket.start<any>({
      requester_id: id,
      organization_id,
      description: '-',
      status_inscricao: 'aprovada',
      subject: `[Psicóloga] ${name} - ${registration_number}`,
      custom_fields: [{
        id: 360021665652,
        value: this.dictionary[condition],
      }, {
        id: 360016631592,
        value: name,
      }, {
        id: 360021812712,
        value: phone,
      }, {
        id: 360021879791,
        value: state,
      }, {
        id: 360021879811,
        value: city,
      }],
    })
  }

  start = () => {
    const { PORT } = process.env
    this.server
      .post('/', async (req, res) => {
        const { status: serviceStatus, serviceName, data } = await filterService(req.body)

        if (serviceStatus === FILTER_SERVICE_STATUS.NOT_DESIRED_SERVICE) {
          return res.status(200).json(`Service "${serviceName}" isn't desired, but everything is OK.`)
        } if (serviceStatus === FILTER_SERVICE_STATUS.INVALID_REQUEST) {
          this.dbg('Erro desconhecido ao filtrar por serviço.')
          return res.status(400).json('Erro desconhecido ao filtrar por serviço.')
        }

        const {
          InstanceClass, results, status: formNameStatus, name, data: errorData, dateSubmitted,
        } = await filterFormName(data!)
        if (formNameStatus === FILTER_FORM_NAME_STATUS.FORM_NOT_IMPLEMENTED) {
          this.dbg(`Form "${name}" not implemented. But it's ok`)
          return res.status(200).json(`Form "${name}" not implemented. But it's ok`)
        } if (formNameStatus === FILTER_FORM_NAME_STATUS.INVALID_REQUEST) {
          this.dbg('Invalid request.')
          this.dbg(errorData)
          return res.status(400).json('Invalid request, see logs.')
        }

        if (!results || !dateSubmitted) {
          return res.status(400).json('Invalid request, failed to parse results')
        }
        const bondeCreatedDate = new BondeCreatedDate(results.email)
        const bondeCreatedAt = await bondeCreatedDate.start()

        if (!bondeCreatedAt) {
          return this.dbg(bondeCreatedAt)
        }

        const instance = await new InstanceClass!(res)
        let user
        if (instance instanceof AdvogadaCreateUser) {
          user = await instance.start(results, bondeCreatedAt!)
        } else if (instance instanceof PsicologaCreateUser) {
          user = await instance.start(results!, bondeCreatedAt!)
        }

        if (!user) {
          return undefined
        }

        const {
          data: {
            user: createdUser, user: {
              created_at: responseCreatedAt,
              updated_at: responseUpdatedAt,
              id: userId,
            },
          },
        } = user
        if (responseCreatedAt === responseUpdatedAt) {
          this.dbg(`Success, created user "${userId}"!`)
        } else {
          this.dbg(`Success, updated user "${userId}"!`)
        }

        const resultTicket = await this.createTicket(instance, createdUser, dateSubmitted, res)
        if (resultTicket) {
          this.dbg(`Success updated ticket "${resultTicket.data.ticket.id}"`)
          return res.status(200).json('Success updated ticket')
        }
        return this.dbg('Failed to create ticket')
      })
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Server listen on port ${PORT}`)
      })
  }
}

export default Server
