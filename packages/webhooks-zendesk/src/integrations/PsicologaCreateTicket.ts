import Base from './Base'
import { Response } from 'express'
import * as yup from 'yup'

class PsicologaCreateTicket extends Base {
  constructor (res: Response) {
    super('PsicólogaCreateTicket', 'tickets', res)
  }

  start = async <T>(data: object) => {
    const validateTicket = yup.object().shape({
      requester_id: yup.number().required(),
      organization_id: yup.number().required(),
      subject: yup.string().required(),
      description: yup.string().required(),
      custom_fields: yup.array().of(yup.object().shape({
        id: yup.number().required(),
        value: yup.mixed().required()
      })),
      created_at: yup.string().required()
    }).required()

    try {
      data = await validateTicket.validate(data, {
        stripUnknown: true
      })
    } catch (e) {
      this.dbg('Falhou ao validar ticket')
    }
    try {
      await this.send<T>({
        ticket: {
          ...data
        }
      })
    } catch (e) {
      this.dbg(e)
    }
  }
}

export default PsicologaCreateTicket
