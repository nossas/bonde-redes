import axios from "axios";

const HasuraBase = <T>(query: string, variables?: { [s: string]: any }) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env;

  return axios.post<T>(HASURA_API_URL, { query, variables } ?? undefined, {
    headers: {
      "x-hasura-admin-secret": X_HASURA_ADMIN_SECRET
    }
  });
};

export default HasuraBase;
