import getUsersByPage from "./zendesk/getUsersByPage";
import User from "./interfaces/User";
import dbg from "./dbg";

const log = dbg.extend('getAllUsers')

const getAllUsers = async () => {
  const users: User[] = [];
  let start_time = 1
  let counter = 0
  while (true) {
    const actualPageUsers = await getUsersByPage(start_time)
    await new Promise(r => setTimeout(r, 5000))
    if (actualPageUsers) {
      const {data: {count, end_time, users: requestedUsers}} = actualPageUsers
      start_time = end_time
      requestedUsers.forEach(i => users.push(i))
      counter += count
      log(`[${counter}], end_time: ${start_time}`)
      if (count < 1000) {
        break
      }
    } else {
      // Posteriormente fazer tratamento para tentar a requisição novamente
    }
  }

  return users
}

export default getAllUsers
