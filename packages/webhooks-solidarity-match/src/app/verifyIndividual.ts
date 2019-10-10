import getUserFromTicket, { UserFromTicket } from "../hasura/getUserFromTicket"
import { Ticket } from "../interfaces/Ticket"

export enum VERIFY_MSR_STATUS {
  NOT_FOUND,
  STATUS_NOT_INSCRIBED,
  TICKET_INVALID_STATUS,
  SUCCESS_JURIDICO,
  SUCCESS_PSICOLOGICO,
  SUCCESS_PSICOLOGICO_E_JURIDICO,
  FAILED_TIPO_ACOLHIMENTO
}

type OK = {
  status: VERIFY_MSR_STATUS.SUCCESS_JURIDICO | VERIFY_MSR_STATUS.SUCCESS_PSICOLOGICO | VERIFY_MSR_STATUS.SUCCESS_PSICOLOGICO_E_JURIDICO
  user: UserFromTicket
}

type NOT_OK = {
  status: Exclude<VERIFY_MSR_STATUS, OK['status']>
}

const verifyMSR = async ({ requester_id, status_acolhimento }: Ticket, user?: UserFromTicket): Promise<OK | NOT_OK> => {
  if (!user) {
    const users = await getUserFromTicket(requester_id)
  
    if (!users || users.length === 0) {
      return {
        status: VERIFY_MSR_STATUS.NOT_FOUND
      }
    }
  
    user = users[0]
  
    if (user.condition !== 'inscrita') {
      return {
        status: VERIFY_MSR_STATUS.STATUS_NOT_INSCRIBED
      }
    }
  }

  if (
    status_acolhimento !== 'solicitação_recebida' &&
    status_acolhimento !== 'encaminhamento__realizado_para_serviço_público'
  ) {
    return {
      status: VERIFY_MSR_STATUS.TICKET_INVALID_STATUS
    }
  }

  if (user.tipo_de_acolhimento === 'jurídico') {
    return {
      status: VERIFY_MSR_STATUS.SUCCESS_JURIDICO,
      user
    }
  } else if (user.tipo_de_acolhimento === 'psicológico') {
    return {
      status: VERIFY_MSR_STATUS.SUCCESS_PSICOLOGICO,
      user
    }
  } else if (user.tipo_de_acolhimento === 'psicológico_e_jurídico') {
    return {
      status: VERIFY_MSR_STATUS.SUCCESS_PSICOLOGICO_E_JURIDICO,
      user
    }
  }

  return {
    status: VERIFY_MSR_STATUS.FAILED_TIPO_ACOLHIMENTO
  }
}

export default verifyMSR
