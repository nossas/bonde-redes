import User, { handleUserFields } from "./interfaces/User"

const getUsersWithUserFields = (users: User[]) => {
  const { COMMUNITY_ID } = process.env
  return users.map(i => {
    const {id, ...otherFields} = i
    return {
      user_id: id,
      ...otherFields,
      ...handleUserFields(i),
      community_id: Number(COMMUNITY_ID)
    }
  })
}

export default getUsersWithUserFields
