import Axios from "axios";

const get = async (route?: any, params?: any) =>
  Axios.get(`/api/${route}`, { params });
const post = async (body: Record<string, any>) =>
  Axios.post("/api/forward", body);

export default {
  get,
  post
};
