import parse from './parse'
import getAllUsers from './hasura/getAllUsers'
import getAllTickets from './hasura/getAllTickets'

const main = async (req, res, next) => {
  res.json(req.body);
}

export default main
