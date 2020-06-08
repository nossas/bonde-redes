import { action } from "easy-peasy";

const errorModel: { error?: string; setError } = {
  error: undefined,
  setError: action((state, payload) => ({
    error: payload
  }))
};

export default errorModel;
