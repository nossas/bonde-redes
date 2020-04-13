import { action } from "easy-peasy";

type Volunteer = {
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

const data: Volunteer = {
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

const volunteersModel = {
  data,
  setVolunteer: action((state, payload) => ({
    data: payload
  })),
  error: {},
  setError: action((state, payload) => ({
    error: payload
  }))
};

export default volunteersModel;
