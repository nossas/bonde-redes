import zendesk from 'node-zendesk'
import parse from './parse'


const clientZD = zendesk.createClient({
  username: process.env.ZENDESK_API_USER,
  token: process.env.ZENDESK_API_TOKEN,
  remoteUri: 'https://mapadoacolhimento.zendesk.com/api/v2',
})

// export default main
const main = async (req, res, next) => {
  const {
    serviceType, lat, lng, distance
  } = req.query
  // TODO: change filter
  if (serviceType !== 'therapist' && serviceType !== 'lawyer') {
    return res.status(400).json({ error: 'Query serviceType is invalid' })
  }

  const id = { therapist: 360282119532, lawyer: 360269610652 }[serviceType]
  
  const searchTerm = `type:user organization_id:${id} condition:inscrita condition:disponível`
  clientZD.search.queryAll(searchTerm, (err, req, data) => {
    if (err) {
      console.error('The API returned an error.')
      throw err
    }
    // Filter by distance
    const result = parse(data, [lng, lat])
      .filter(user => user.distance < Number(distance))
      .sort((u1, u2) => u1.distance - u2.distance)

    return res.json(result)
  })
}

export default main
