import Base from './Base'
import User from '../interfaces/User'
import dbg from './dbg'

export interface UserResponse {
  users: User[]
  next_page: string
  end_time: number
  count: number
}

const getUsersByPage = (start_time: number) => Base.get<UserResponse>(
  'incremental/users',
  dbg.extend('getUsersByPage'),
  { start_time },
)

export default getUsersByPage
