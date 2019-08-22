import Express from 'express'
import debug, { Debugger } from 'debug'
import axios from 'axios'
import * as yup from 'yup'
import urljoin from 'url-join'
import AdvogadaCreateUser from './integrations/AdvogadaCreateUser'
import Base from './integrations/Base'
import PsicólogaCreateUser from './integrations/PsicólogaCreateUser'

interface DataType {
  data: {
    logTable: {
      returning: Array<{
        id: number
      }>
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

  private filterService = (payload: any) => {
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

  private filterFormName = async (json: any) => {
    let data: any
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
        InstanceClass = PsicólogaCreateUser
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

        const instance = await new InstanceClass!(results, createdAt, res)
        instance.start()
        // if (!data) {
        //   return this.dbg('not desired service')
        // }
        // await this.validate(data)
        // if (this.formData) {
        //   if (await this.send()) {
        //     res.status(200).json('OK!')
        //   } else {
        //     res.status(500).json('Erro ao salvar usuário')
        //   }
        // } else {
        //   res.status(400).json('malformed json')
        // }
      })
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Server listen on port ${PORT}`)
      })
  }
}

export default Server
