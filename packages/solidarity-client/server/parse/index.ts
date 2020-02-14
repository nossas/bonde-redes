import calcDistance from './calcDistance'

const addDistance = (user, pointA) => {
  const lat = Number(user.latitude)
  const lng = Number(user.longitude)
  return {
    ...user,
    distance: calcDistance(pointA, [lng, lat])
  }
}

export default (result, pointA) => result
  .map(user => addDistance(user, pointA))

interface Organizations {
  lawyer: number
  therapist: number
  individual: number
}

const parseZendeskOrganizations = input => JSON.parse(input)
export const zendeskOrganizations: Organizations = parseZendeskOrganizations(process.env.REACT_APP_ZENDESK_ORGANIZATIONS!)

const LAWYER = zendeskOrganizations.lawyer
const THERAPIST = zendeskOrganizations.therapist

export const getCurrentDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()

  return `${yyyy}-${mm}-${dd}`
}

export const getVolunteerFile = id => {
  if (id === LAWYER) return {
    path: 'diretrizes_atendimento_advogada.pdf',
    filename: 'Diretrizes_de_Atendimento___Advogadas_Voluntarias.pdf'
  }
  if (id === THERAPIST) return {
    path: 'diretrizes_atendimento_psicologa.pdf',
    filename: 'Diretrizes_de_Atendimento___Psicologas_Voluntarias.pdf'
  }
  throw "Volunteer organization_id not supported in search for file"
}

export const getVolunteerType = id => {
  if (id === LAWYER) return {
    type: 'Advogada',
    registry_type: 'OAB'
  }
  if (id === THERAPIST) return {
    type: 'Psicóloga',
    registry_type: 'CRP'
  }
  throw new Error("Volunteer organization_id not supported in search for type")
}
