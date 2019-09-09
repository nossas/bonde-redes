import Base from './Base'

class ListTickets extends Base {
  constructor () {
    super('ListTickets', `tickets`, 'GET')
  }

  start = async <T>(page?: string) => {
    return this.send<T>(page)
  }
}
export default ListTickets
