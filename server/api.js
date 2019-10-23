import parse from './parse'
import getAllUsers from './hasura/getAllUsers'

// export default main
const main = async (req, res, next) => {
  const {
    serviceType, lat, lng, distance
  } = req.query
  // TODO: change filter
  const services = ['therapist', 'lawyer', 'individual']

  if (!services.includes(serviceType)) {
    return res.status(400).json({ error: 'Query serviceType is invalid' })
  }

  const organizationId = { therapist: 360282119532, lawyer: 360269610652, individual: 360273031591 }[serviceType]

  const data = await getAllUsers(organizationId)

  if (!data) {
    console.error('The API returned an error.')
  }

  const result = parse(data, [lng, lat])
    .filter(user => user.distance < Number(distance))
    .sort((u1, u2) => u1.distance - u2.distance)

  res.json(result)
}

export default main
