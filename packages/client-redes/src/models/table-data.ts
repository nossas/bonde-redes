import { action, computed } from "easy-peasy";
import { Individual } from "../graphql/FetchIndividuals";

const data: Individual[] = [];

const tableModel = {
  data,
  setTable: action((state, payload) => ({
    data: payload
  })),
  count: computed((state: any) => state.data.length),
  error: {},
  setError: action((state, payload) => ({
    error: payload
  }))
};

export default tableModel;
