import { thunk, action } from "easy-peasy";
import request from "../services/request";
import { Ticket } from "../types";

const volunteers: Ticket[] = [];

const volunteersModel = {
  getAvailableVolunteers: thunk(async (actions: any) => {
    actions.setVolunteers("pending");
    try {
      const res = await request.get("volunteers");
      actions.setVolunteers(res.data);
    } catch (err) {
      console.log(err);
      actions.setError(err && err.message);
    }
  }),
  volunteers,
  setVolunteers: action((state, payload) => ({
    volunteers: payload
  })),
  error: undefined,
  setError: action((state, payload) => ({
    error: payload
  }))
};

export default volunteersModel;
