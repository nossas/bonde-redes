import Express from 'express'
import debug, { Debugger } from 'debug'
import axios from 'axios'
import * as yup from 'yup'

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
    this.dbg = debug(`webhook-logs`)
  }

  // private request = async (serviceName: string, data: any) => {
  //   const { HASURA_API_URL, HASURA_TABLE_NAME } = process.env
  //   try {
  //     const json = JSON.stringify(data)
  //     const { data: { data: { logTable: { returning: [{ id }] } } } } = await axios.post<DataType>(HASURA_API_URL, {
  //       query: mutation(HASURA_TABLE_NAME),
  //       variables: { json, service_name: serviceName }
  //     })
  //     this.dbg(`Success logged "${serviceName}" req with id "${id}"`)
  //   } catch (e) {
  //     this.dbg(e)
  //   }
  // }

  private validate = async (json: any) => {
    const a = {
      'mautic.form_on_submit': [{
        submission: {
          id: 20,
          ipAddress: {
            ip: '187.105.22.79',
            id: 22,
            ipDetails: {
              city: 'Natal',
              region: 'Rio Grande do Norte',
              zipcode: null,
              country: 'Brazil',
              latitude: -5.8109,
              longitude: -35.2238,
              isp: '',
              organization: '',
              timezone: 'America/Fortaleza',
              extra: ''
            }
          },
          form: {
            id: 5,
            name: 'Formulário Teste Integração',
            alias: 'formulario',
            category: null
          },
          lead: null,
          trackingId: null,
          dateSubmitted: '2019-08-16T17:59:56-03:00',
          referer: 'https://mautic.nossas.org/s/forms/preview/5',
          page: null,
          results: {
            cep: '59090-455'
          }
        },
        timestamp: '2019-08-16T17:59:56-03:00'
      }]
    }
    const validation = yup.object().shape({
      'mautic.form_on_submit': yup.array().of(yup.object().shape({
        submission: yup.object().shape({
          form: yup.object().shape({
            name: yup.string().matches(/Formulário Teste Integração/).required()
          }),
          results: yup.object().shape({
            cep: yup
              .string()
              .required()
              .transform((i: string) => i.split('').filter(j => j.match(/\d/)).join(''))
              .length(8)
          })
        })
      }))
    })

    try {
      const validatedForm = await validation.validate(a)
      this.formData = validatedForm['mautic.form_on_submit'][0].submission.results
    } catch (e) {
      this.dbg('validation failed', e)
    }
  }

  start = () => {
    const { PORT } = process.env
    this.server
      .get('/', async (req, res) => {
        await this.validate(req.body)
        if (this.formData) {
          res.status(200).json('OK!')
        } else {
          res.status(400).json('malformed json')
        }
      })
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Server listen on port ${PORT}`)
      })
  }
}

export default Server
