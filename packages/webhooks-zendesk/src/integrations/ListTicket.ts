import { Response } from 'express'
import Base from './Base'

class ListTicketsFromUser extends Base {
  constructor(userId: string, res: Response) {
    super('AdvogadaCreateTicket', `users/${userId}/tickets/requested`, res, 'GET')
  }

  start = async () => this.send()
}

export default ListTicketsFromUser
