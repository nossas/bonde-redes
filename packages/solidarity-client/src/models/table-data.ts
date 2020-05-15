import { action, thunk } from "easy-peasy";
import request from "../services/request";
import { Ticket } from "../types";

const data: Ticket[] = [];

const tableModel = {
  data,
  setTable: action((state, payload) => ({
    data: payload
  })),
  getTableData: thunk(
    async (
      actions: any,
      payload: { endpoint: string; volunteer_organization_id?: number }
    ) => {
      actions.setTable("pending");
      const { endpoint, volunteer_organization_id = 0 } = payload;
      try {
        const res = await request.get(endpoint, { volunteer_organization_id });
        actions.setTable(res.data);
      } catch (err) {
        console.log(err);
        actions.setError(err && err.message);
      }
    }
  ),
  error: undefined,
  setError: action((state, payload) => ({
    error: payload
  }))
};

export default tableModel;
