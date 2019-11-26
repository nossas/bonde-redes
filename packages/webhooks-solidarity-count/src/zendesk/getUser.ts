import ZendeskBase from './ZendeskBase'
import User from '../interfaces/User'

interface Response {
  user: User
}

const getUser = (id: number) => ZendeskBase.get<Response>(`users/${id}`)

export default getUser
