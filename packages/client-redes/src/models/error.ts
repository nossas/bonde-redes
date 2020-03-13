import { action } from "easy-peasy";

type Error = {
  status: boolean;
  message: string;
};

const error: Error = {
  status: false,
  message: ""
};

const errorModel = {
  error,
  setError: action((state, payload) => ({
    error: { ...payload }
  }))
};

export default errorModel;
