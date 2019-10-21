import updateRequesterFields from './zendesk/updateRequesterFields'
import { Requester } from './interfaces/Requester'
import dbg from './dbg'

const log = dbg.extend('sendSlicedRequesters')

const sendSlicedRequesters = async (
  slicedRequesters: Requester[],
  tries: number,
  counter: number,
): Promise<boolean> => {
  if (counter >= tries) {
    log('Tentou mais de três vezes', slicedRequesters)
    return false
  }
  const response = await updateRequesterFields(slicedRequesters)

  await new Promise((r) => setTimeout(r, 1000))

  if (!response) {
    log('Resposta indefinida!')
    return sendSlicedRequesters(slicedRequesters, tries, counter + 1)
  }

  if (response.status !== 200) {
    log('Resposta diferente de 200 para o usuário', slicedRequesters)
    return sendSlicedRequesters(slicedRequesters, tries, counter + 1)
  }

  return true
}

export default sendSlicedRequesters
