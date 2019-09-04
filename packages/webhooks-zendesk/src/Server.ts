import Express, { Response } from 'express'
import debug, { Debugger } from 'debug'
import * as yup from 'yup'
import AdvogadaCreateUser from './integrations/AdvogadaCreateUser'
import PsicologaCreateUser from './integrations/PsicólogaCreateUser'
import ListTicketsFromUser from './integrations/ListTicket'
import AdvogadaCreateTicket from './integrations/AdvogadaCreateTicket'
import AdvogadaUpdateTicket from './integrations/AdvogadaUpdateTicket'
import PsicologaCreateTicket from './integrations/PsicologaCreateTicket'
import PsicologaUpdateTicket from './integrations/PsicologaUpdateTicket'

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

export enum FILTER_SERVICE_STATUS {
  SUCCESS,
  NOT_DESIRED_SERVICE,
  INVALID_REQUEST
}

export enum FILTER_FORM_NAME_STATUS {
  SUCCESS,
  FORM_NOT_IMPLEMENTED,
  INVALID_REQUEST,
  INVALID_JSON,
}

class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  private formData?: FormData

  constructor () {
    this.dbg = debug(`webhooks-zendesk`)
  }

  private filterService = (
    payload: {
      event: {
        data: {
          new: {
            service_name: string
            data: object
            created_at: string
          }
        }
      }
    }
  ) => {
    try {
      const { event: { data: { new: { service_name: serviceName, data, created_at: createdAt } } } } = payload
      this.dbg(`received service "${serviceName}"`)
      if (serviceName !== 'mautic-form') {
        this.dbg(`${serviceName} not desired service`)
        return {
          status: FILTER_SERVICE_STATUS.NOT_DESIRED_SERVICE,
          serviceName
        }
      }
      return {
        status: FILTER_SERVICE_STATUS.SUCCESS,
        data,
        createdAt
      }
    } catch (e) {
      this.dbg(e)
      return {
        status: FILTER_SERVICE_STATUS.INVALID_REQUEST
      }
    }
  }

  private filterFormName = async (json: string) => {
    let data
    try {
      data = JSON.parse(json)
    } catch (e) {
      return {
        status: FILTER_FORM_NAME_STATUS.INVALID_JSON,
        json
      }
    }
    const validation = yup.object().shape({
      'mautic.form_on_submit': yup.array().of(yup.object().shape({
        submission: yup.object().shape({
          form: yup.object().shape({
            name: yup.string().required()
          }),
          results: yup.object().required()
        })
      }))
    })
    let validationResult
    try {
      validationResult = await validation.validate(data)
    } catch (e) {
      this.dbg(e)
      return {
        status: FILTER_FORM_NAME_STATUS.INVALID_REQUEST,
        data
      }
    }
    const { 'mautic.form_on_submit': [{ submission: { form: { name }, results } }] } = validationResult
    let InstanceClass
    switch (name) {
      case 'Recadastro: Advogadas Ativas':
        InstanceClass = AdvogadaCreateUser
        break
      case 'Recadastro: Psicólogas Ativas':
        InstanceClass = PsicologaCreateUser
        break
      default:
        this.dbg(`InstanceClass "${name}" doesn't exist`)
        return {
          status: FILTER_FORM_NAME_STATUS.FORM_NOT_IMPLEMENTED,
          name
        }
    }
    return {
      status: FILTER_FORM_NAME_STATUS.SUCCESS,
      InstanceClass,
      results
    }
  }

  dictionary: {[s: string]: string} = {
    aprovada: 'aprovada',
    reprovada_estudo_de_caso: 'reprovada_-_estudo_de_caso',
    reprovada_registro_inválido: 'reprovada_-_registro_inválido',
    reprovada_diretrizes_do_mapa: 'reprovada_-_diretrizes_do_mapa'
  }

  createTicket = async (instance: any, {
    id,
    organization_id,
    name,
    phone,
    user_fields: {
      registration_number,
      condition,
      state,
      city
    },
    created_at
  }: any, res: Response) => {
    const listTickets = new ListTicketsFromUser(id, res)
    const tickets = await listTickets.start()
    if (!tickets) {
      return
    }
    const filteredTickets = tickets.data.tickets.filter((i: any) => {
      if (instance instanceof AdvogadaCreateUser) {
        return ['open', 'new', 'pending', 'hold'].includes(i.status) && i.subject === `[Advogada] ${name} - ${registration_number}`
      } else if (instance instanceof PsicologaCreateUser) {
        return ['open', 'new', 'pending', 'hold'].includes(i.status) && i.subject === `[Psicóloga] ${name} - ${registration_number}`
      }
    })
    if (filteredTickets.length === 0) {
      if (instance instanceof AdvogadaCreateUser) {
        const advogadaCreateTicket = new AdvogadaCreateTicket(res)
        return advogadaCreateTicket.start<any>({
          requester_id: id,
          organization_id,
          description: '-',
          subject: `[Advogada] ${name} - ${registration_number}`,
          custom_fields: [{
            id: 360021665652,
            value: this.dictionary[condition]
          }, {
            id: 360016631592,
            value: name
          }, {
            id: 360021812712,
            value: phone
          }, {
            id: 360021879791,
            value: state
          }, {
            id: 360021879811,
            value: city
          }],
          created_at
        })
      } else if (instance instanceof PsicologaCreateUser) {
        const psicólogaCreateTicket = new PsicologaCreateTicket(res)
        return psicólogaCreateTicket.start<any>({
          requester_id: id,
          organization_id,
          description: '-',
          subject: `[Psicóloga] ${name} - ${registration_number}`,
          custom_fields: [{
            id: 360021665652,
            value: this.dictionary[condition]
          }, {
            id: 360016631592,
            value: name
          }, {
            id: 360021812712,
            value: phone
          }, {
            id: 360021879791,
            value: state
          }, {
            id: 360021879811,
            value: city
          }],
          created_at
        })
      }
    } else {
      if (instance instanceof AdvogadaCreateUser) {
        const advogadaUpdateTicket = new AdvogadaUpdateTicket(filteredTickets[0].id, res)
        return advogadaUpdateTicket.start<any>({
          requester_id: id,
          organization_id,
          description: '-',
          subject: `[Advogada] ${name} - ${registration_number}`,
          custom_fields: [{
            id: 360021665652,
            value: this.dictionary[condition]
          }, {
            id: 360016631592,
            value: name
          }, {
            id: 360021812712,
            value: phone
          }, {
            id: 360021879791,
            value: state
          }, {
            id: 360021879811,
            value: city
          }]
        })
      } else if (instance instanceof PsicologaCreateUser) {
        const psicólogaUpdateTicket = new PsicologaUpdateTicket(filteredTickets[0].id, res)
        return psicólogaUpdateTicket.start<any>({
          requester_id: id,
          organization_id,
          description: '-',
          subject: `[Psicóloga] ${name} - ${registration_number}`,
          custom_fields: [{
            id: 360021665652,
            value: this.dictionary[condition]
          }, {
            id: 360016631592,
            value: name
          }, {
            id: 360021812712,
            value: phone
          }, {
            id: 360021879791,
            value: state
          }, {
            id: 360021879811,
            value: city
          }]
        })
      }
    }
  }

  start = () => {
    const { PORT } = process.env
    this.server
      .post('/', async (req, res) => {
        const { status: serviceStatus, serviceName, createdAt, data } = await this.filterService(req.body)

        if (serviceStatus === FILTER_SERVICE_STATUS.NOT_DESIRED_SERVICE) {
          return res.status(200).json(`Service "${serviceName}" isn't desired, but everything is OK.`)
        } else if (serviceStatus === FILTER_SERVICE_STATUS.INVALID_REQUEST) {
          this.dbg(`Erro desconhecido ao filtrar por serviço.`)
          return res.status(400).json(`Erro desconhecido ao filtrar por serviço.`)
        }

        const { InstanceClass, results, status: formNameStatus, name, json, data: errorData } = await this.filterFormName(data)
        if (formNameStatus === FILTER_FORM_NAME_STATUS.FORM_NOT_IMPLEMENTED) {
          this.dbg(`Form "${name}" not implemented. But it's ok`)
          return res.status(200).json(`Form "${name}" not implemented. But it's ok`)
        } else if (formNameStatus === FILTER_FORM_NAME_STATUS.INVALID_JSON) {
          this.dbg(`Invalid JSON saved on database.`)
          this.dbg(json)
          return res.status(400).json(`Invalid JSON saved on database, see logs.`)
        } else if (formNameStatus === FILTER_FORM_NAME_STATUS.INVALID_REQUEST) {
          this.dbg(`Invalid request.`)
          this.dbg(errorData)
          return res.status(400).json(`Invalid request, see logs.`)
        }

        const instance = await new InstanceClass!(res)
        let user
        if (instance instanceof AdvogadaCreateUser) {
          user = await instance.start(results, createdAt)
        } else if (instance instanceof PsicologaCreateUser) {
          user = await instance.start(results, createdAt)
        }

        if (!user) {
          return
        }

        const { data: { user: createdUser, user: { created_at: responseCreatedAt, updated_at: responseUpdatedAt, id: userId } } } = user
        // this.dbg(createdUser)
        if (responseCreatedAt === responseUpdatedAt) {
          this.dbg(`Success, created user "${userId}"!`)
        } else {
          this.dbg(`Success, updated user "${userId}"!`)
        }

        const resultTicket = await this.createTicket(instance, createdUser, res)
        if (resultTicket) {
          this.dbg(`Success updated ticket "${resultTicket.data.ticket.id}"`)
        } else {
          this.dbg(`Failed to create ticket`)
        }
      })
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Server listen on port ${PORT}`)
      })
  }
}

export default Server
