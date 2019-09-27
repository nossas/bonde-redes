import getUsersByPage from "./zendesk/getUsersByPage";
import User from "./interfaces/User";
import dbg from "./dbg";

const log = dbg.extend('getAllUsers')

const getAllUsers = async () => {
  let users: User[] = [];
  let actualPageNumber = 1
  while (true) {
    const actualPageUsers = await getUsersByPage(actualPageNumber)
    if (actualPageUsers) {
      users = [...users, ...actualPageUsers.data.users]
      if (actualPageUsers.data.next_page) {
        log(`[${Number(actualPageNumber) * 100}/${actualPageUsers.data.count}]`)
        actualPageNumber = actualPageNumber + 1
      } else {
        log(`[${Number(actualPageUsers && actualPageUsers.data.count)}/${actualPageUsers && actualPageUsers.data.count}]`)
        break
      }
    } else {
      // Posteriormente fazer tratamento para tentar a requisição novamente
    }
  }

  return users
}

export default getAllUsers
