import { action, thunk } from "easy-peasy";
import request from "../services/request";

export type Ticket = {
  tipo_de_acolhimento: string;
  status_inscricao: string;
  status_acolhimento: string;
  ticket_status: string;
  ticket_id: number;
  ticket_created_at: string;
  latitude: string;
  longitude: string;
  name: string;
  email: string;
  data_de_inscricao_no_bonde?: string;
  user_id: number;
  condition: string;
  organization_id: number;
  whatsapp: string;
  registration_number: string;
  phone: string;
};

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
