import { action } from "easy-peasy";

type Individual = {
  coordinates: {
    latitude: string;
    longitude: string;
  };
  email: string;
  first_name: string;
  whatsapp: string;
  id: number;
  phone: string;
};

const data: Individual = {
  coordinates: {
    latitude: "0",
    longitude: "0"
  },
  email: "",
  first_name: "",
  whatsapp: "",
  id: 0,
  phone: ""
};

const individualModel = {
  data,
  setIndividual: action((state, payload) => ({
    data: payload
  }))
};

export default individualModel;
