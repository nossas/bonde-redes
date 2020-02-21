import getSolidarityUsers from './hasura/getSolidarityUsers'

const main = async (req, res, next) => {
  const locations = await getSolidarityUsers({
    query: `query ($id: bigint!){
      solidarity_users(
        where: {
          user_id: {_eq: $id},
        }
      ) {
        user_id
        email
        name
        organization_id
        latitude
        longitude
        data_de_inscricao_no_bonde
        condition
        whatsapp
        phone
      }
    }`,
    variables: {
      id: req.query.id
    }
  })

  res.json(locations)
}

export default main
