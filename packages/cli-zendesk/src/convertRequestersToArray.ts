import { Requesters, Requester } from './interfaces/Requester'

const convertRequestersToArray = (
  requesters: Requesters,
) => Object.values(requesters) as Requester[]

export default convertRequestersToArray
