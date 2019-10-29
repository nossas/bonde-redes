import User, { handleUserFields } from './interfaces/User'

const getUsersWithUserFields = (users: User[]): User[] => {
  const { COMMUNITY_ID } = process.env
  return users.map((i) => {
    const withUserFields = handleUserFields(i)
    const { id, ...otherFields } = withUserFields
    return {
      ...otherFields,
      user_id: id,
      community_id: Number(COMMUNITY_ID),
    }
  })
}

export default getUsersWithUserFields
