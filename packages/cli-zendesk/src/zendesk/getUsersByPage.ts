import Base from './Base'
import User from '../interfaces/User'
import dbg from './dbg'

export interface UserResponse {
  users: User[]
  next_page: string
  count: number
}

const getUsersByPage = (page: number) => {
  const sort_by = 'created_at'
  return Base.get<UserResponse>('users', dbg.extend('getUsersByPage'), {page, sort_by})
}

export default getUsersByPage
