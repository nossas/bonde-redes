import { Response } from 'express'
import * as yup from 'yup'
import Base from './Base'

class PsicologaCreateTicket extends Base {
  constructor(res: Response) {
    super('PsicólogaCreateTicket', 'tickets', res)
  }

  start = async <T>(data: object) => {
    let newData = data
    const validateTicket = yup.object().shape({
      requester_id: yup.number().required(),
      organization_id: yup.number().required(),
      subject: yup.string().required(),
      description: yup.string().required(),
      custom_fields: yup.array().of(yup.object().shape({
        id: yup.number().required(),
        value: yup.mixed().nullable(),
      })),
      status_inscricao: yup.string().required(),
      created_at: yup.string().required(),
    }).required()

    try {
      newData = await validateTicket.validate(newData, {
        stripUnknown: true,
      })
    } catch (e) {
      return this.dbg('Falhou ao validar ticket')
    }
    try {
      return this.send<T>({
        ticket: {
          ...newData,
        },
      })
    } catch (e) {
      return this.dbg(e)
    }
  }
}

export default PsicologaCreateTicket
