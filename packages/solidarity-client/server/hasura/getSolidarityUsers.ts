import axios from "axios";

const getSolidarityUsers = async ({ query, variables = {} }) => {
  const { HASURA_API_URL, X_HASURA_ADMIN_SECRET } = process.env;
  const response = await axios.post(
    HASURA_API_URL || "",
    {
      query,
      variables
    },
    {
      headers: {
        "x-hasura-admin-secret": X_HASURA_ADMIN_SECRET
      }
    }
  );

  try {
    return response.data.data.solidarity_users;
  } catch (e) {
    console.log(response.data.errors);
    return null;
  }
};

export default getSolidarityUsers;
