import { Requesters, Requester } from "./interfaces/Requester"

const convertRequestersToArray = (requesters: Requesters) => {
  return Object.values(requesters) as Requester[]
}

export default convertRequestersToArray
