import { Response } from 'express'
import * as yup from 'yup'
import Base from './Base'

class AdvogadaUpdateTicket extends Base {
  constructor(ticketId: number, res: Response) {
    super('AdvogadaUpdateTicket', `tickets/${ticketId.toString()}`, res, 'PUT')
  }

  start = async <T = any>(data: any) => {
    let newData = data
    const validateTicket = yup.object().shape({
      requester_id: yup.number().required(),
      organization_id: yup.number().required(),
      subject: yup.string().required(),
      description: yup.string().required(),
      custom_fields: yup.array().of(yup.object().shape({
        id: yup.number().required(),
        value: yup.mixed().required(),
      })),
      status_inscricao: yup.string().required(),
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

export default AdvogadaUpdateTicket
