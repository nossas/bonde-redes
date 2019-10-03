import dbg from "./dbg"
import saveUsers from "./hasura/saveUsers"
import User from "./interfaces/User"

const log = dbg.extend('saveUsersInChunks')

const saveUsersInChunks = async (users: User[]) => {
  let offset = 0
  const limit = 1000
  while (true) {
    log(`[${offset+limit > users.length ? users.length : offset+limit}/${users.length}]`)
    await saveUsers(users.slice(offset, offset + limit))
    await new Promise(r => setTimeout(r, 1000))
    if (offset + limit >= users.length) {
      break
    }
    offset += limit
  }
}

export default saveUsersInChunks
