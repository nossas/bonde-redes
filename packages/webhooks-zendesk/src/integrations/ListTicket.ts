import Base from './Base'
import { Response } from 'express'

class ListTicketsFromUser extends Base {
  constructor (userId: string, res: Response) {
    super('AdvogadaCreateTicket', `users/${userId}/tickets/requested`, res, 'GET')
  }

  start = async () => {
    return this.send()
  }
}

export default ListTicketsFromUser
