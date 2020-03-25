import { action } from "easy-peasy";

type Volunteer = {
  latitude: string;
  longitude: string;
  email: string;
  name: string;
  whatsapp: string;
  id: number;
  phone: string;
};

const data: Volunteer = {
  latitude: "0",
  longitude: "0",
  email: "",
  name: "",
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
