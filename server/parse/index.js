import calcDistance from './calcDistance'


const onlyWithLocation = ({ user_fields: { latitude, longitude } }) => {
  return latitude != null && longitude != null
}

const addDistance = (user, pointA) => {
  const lat = Number(user.user_fields.latitude)
  const lng = Number(user.user_fields.longitude)
  return {
    ...user,
    distance: calcDistance(pointA, [lng, lat])
  }
}

export default (result, pointA) => result
  .filter(onlyWithLocation)
  .map(user => addDistance(user, pointA))
