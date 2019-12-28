import { action } from 'easy-peasy';

const agentModel = {
  data: "",
  setAgent: action((state, payload) => ({
    data: payload
  }))
};

export default agentModel