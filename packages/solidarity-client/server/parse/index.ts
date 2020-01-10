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
