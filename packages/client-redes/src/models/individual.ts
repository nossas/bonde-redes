import { action } from "easy-peasy";

type Individual = {
  email: string;
  first_name: string;
  phone: string;
  id: number;
};

const data: Individual = {
  email: "",
  first_name: "",
  phone: "",
  id: 0
};

const individualModel = {
  data,
  setIndividual: action((state, payload) => ({
    data: payload
  }))
};

export default individualModel;
