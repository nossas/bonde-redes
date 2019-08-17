import Express from 'express'
import debug, { Debugger } from 'debug'
import axios from 'axios'
import * as yup from 'yup'
import urljoin from 'url-join'

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

  private send = async () => {
    const { ZENDESK_API_URL, ZENDESK_API_TOKEN } = process.env

    const data = {
      user: {
        name: 'Gabriel Rocha de Oliveira',
        ...this.formData
      }
    }

    const endpoint = urljoin(ZENDESK_API_URL!, 'users')
    try {
      const result = await axios.post(endpoint, data, {
        auth: {
          username: 'rolivegab@gmail.com/token',
          password: ZENDESK_API_TOKEN
        }
      })
      this.dbg(`Success created user ${result.data.user.id}`)
      return true
    } catch (e) {
      this.dbg(JSON.stringify(e.response.data, null, 2))
      return false
    }
  }

  private filter = (payload: any) => {
    try {
      const { event: { data: { new: { service_name: serviceName, data } } } } = payload
      if (serviceName === 'mautic-test-form') {
        return JSON.parse(data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  private validate = async (json: any) => {
    const { FORM_NAME } = process.env
    const validation = yup.object().shape({
      'mautic.form_on_submit': yup.array().of(yup.object().shape({
        submission: yup.object().shape({
          form: yup.object().shape({
            name: yup.string().test('form name', 'not desired form', value => value === FORM_NAME).required()
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
      const validatedForm = await validation.validate(json)
      this.formData = validatedForm['mautic.form_on_submit'][0].submission.results
    } catch (e) {
      if (e.type === 'form name') {
        this.dbg('not desired form:', e.params.value)
      } else {
        this.dbg('validation failed', e)
      }
    }
  }

  start = () => {
    const { PORT } = process.env
    this.server
      .post('/', async (req, res) => {
        const data = await this.filter(req.body)
        await this.validate(data)
        if (this.formData) {
          if (await this.send()) {
            res.status(200).json('OK!')
          } else {
            res.status(500).json('Erro ao salvar usuário')
          }
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
