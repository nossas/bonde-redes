import { thunk, action } from "easy-peasy";
// import request from '../services/request'

interface Foward {
  setError: Function;
  setSuccess: Function;
  data: {
    volunteer_name: string;
    individual_name: string;
    volunteer_phone: string;
    volunteer_user_id: number;
    individual_user_id: number;
  };
}

const fowardModel = {
  data: {},
  fowardTickets: thunk(async (actions: any, payload: Foward) => {
    const { setError, setSuccess, data } = payload;
    try {
      console.log(data);
      // const mockedBody = {
      //   volunteer_name: "Ana Teste teste",
      //   individual_name: "ANA MSR teste match automatizado",
      //   individual_ticket_id: 16013,
      //   agent: 373018450472,
      //   volunteer_organization_id: 360269610652,
      //   volunteer_registry: "99999",
      //   volunteer_phone: "11999999999",
      //   volunteer_user_id: 377577169651,
      //   assignee_name: "Ana"
      // }
      // const response = await request.post(data)
      setSuccess(true);
      return {
        status: 200
      };
    } catch (err) {
      console.log(err);
      setError({
        status: true,
        message: err && err.message
      });
    }
  }),
  setResponse: action((state, payload) => ({
    ...payload
  }))
};

export default fowardModel;
