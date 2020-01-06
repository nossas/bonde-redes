import { action } from 'easy-peasy'
import dicioAgent from '../pages/Match/Table/dicioAgent'

type agentTypes = keyof typeof dicioAgent | 'default'

const data: agentTypes = 'default'

const agentModel = {
  data,
  setAgent: action((state, payload) => ({
    data: payload
  }))
};

export default agentModel