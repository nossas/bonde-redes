import getSolidarityUsers from './hasura/getSolidarityUsers'

const main = async (req, res, next) => {
  const locations = await getSolidarityUsers({
    query: `query {
      solidarity_users(
        where: {
          longitude: {_is_null: false}, 
          latitude: {_is_null: false},
        }
      ) {
        user_id
        latitude
        longitude
      }
    }`
  })

  res.json(locations)
}

export default main
