import * as yup from 'yup'
import { ORGANIZATIONS } from "../interfaces/Organizations"
import dbg from './dbg'

const log = dbg.extend('verifyOrganizations')

const verifyOrganization = async (organization_id: number) => {
  const {ZENDESK_ORGANIZATIONS} = process.env
  try {
    const organizations = await yup.object().shape({
      'ADVOGADA': yup.number().required(),
      'MSR': yup.number().required(),
      'PSICÓLOGA': yup.number().required()
    }).validate(JSON.parse(ZENDESK_ORGANIZATIONS))

    switch (organization_id) {
      case organizations.ADVOGADA:
        return ORGANIZATIONS.ADVOGADA
      case organizations.MSR:
        return ORGANIZATIONS.MSR
      case organizations.PSICÓLOGA:
        return ORGANIZATIONS.PSICOLOGA
      default:
        return null
    }
  } catch (e) {
    log(e)
    return null
  }
}

export default verifyOrganization
