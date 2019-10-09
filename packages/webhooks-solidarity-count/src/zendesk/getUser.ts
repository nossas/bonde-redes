import Base from "./Base"
import User from "../interfaces/User"

interface Response {
  user: User
}

const getUser = (id: number) => {
  return Base.get<Response>(`users/${id}`)
}

export default getUser
