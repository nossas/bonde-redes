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

class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  private formData?: FormData

  constructor () {
    this.dbg = debug(`webhooks-zendesk`)
  }

  private filterService = (payload: any, res: Express.Response) => {
    try {
      const { event: { data: { new: { service_name: serviceName, data, created_at: createdAt } } } } = payload
      this.dbg(`received service "${serviceName}"`)
      if (serviceName !== 'mautic-form') {
        res.status(200).json(`Service "${serviceName}" isn't desired, but everything is OK.`)
        throw new Error(`${serviceName} not desired service`)
      }
      this.filterFormName(data, createdAt, res)
    } catch (e) {
      this.dbg(e)
    }
  }

  private filterFormName = async (json: any, createdAt: string, res: Express.Response) => {
    try {
      const data = JSON.parse(json)
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
      const { 'mautic.form_on_submit': [{ submission: { form: { name }, results } }] } = await validation.validate(data)
      let InstanceClass: Base
      switch (name) {
        case 'Recadastro: Advogadas Ativas':
          InstanceClass = new AdvogadaCreateUser(results, createdAt, res)
          break
        case 'Recadastro: Psicólogas Ativas':
          InstanceClass = new PsicólogaCreateUser(results, createdAt, res)
          break
        default:
          this.dbg(`InstanceClass "${name}" doesn't exist`)
          res.status(200).send(`Integração para o formulário "${name}" não disponível! Mas tudo OK!`)
          return
      }
      return await InstanceClass.start()
    } catch (e) {
      this.dbg(e)
    }
  }

  start = () => {
    const { PORT } = process.env
    this.server
      .post('/', async (req, res) => {
        await this.filterService(req.body, res)
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
