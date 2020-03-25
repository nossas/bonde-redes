import axios from "axios";

interface Match {
  id?: number;
  created_at: string;
  individuals_ticket_id: number;
  volunteers_ticket_id: number;
  individuals_user_id: number;
  volunteers_user_id: number;
  community_id: number;
  status: string;
}

const generateVariables = `
$community_id: Int
$created_at: timestamp
$individuals_ticket_id: bigint
$individuals_user_id: bigint
$volunteers_ticket_id: bigint
$volunteers_user_id: bigint
$status: String
`;

const generateObjects = `
community_id: $community_id
created_at: $created_at
individuals_ticket_id: $individuals_ticket_id
individuals_user_id: $individuals_user_id
volunteers_ticket_id: $volunteers_ticket_id
volunteers_user_id: $volunteers_user_id
status: $status
`;

const CREATE_MATCH_TICKET_MUTATION = `mutation createMatchTicket(${generateVariables}) {
  insert_solidarity_matches (objects: {${generateObjects}}, on_conflict: {
    constraint: solidarity_matches_individuals_ticket_id_volunteers_ticket__key, update_columns: [
      community_id
      created_at
      individuals_user_id
      volunteers_user_id
      status
    ]}) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const saveMatch = async (matchVariables: Match) => {
  const { HASURA_API_URL = "", X_HASURA_ADMIN_SECRET } = process.env;
  const response = await axios.post(
    HASURA_API_URL,
    {
      query: CREATE_MATCH_TICKET_MUTATION,
      variables: { ...matchVariables }
    },
    {
      headers: {
        "x-hasura-admin-secret": X_HASURA_ADMIN_SECRET
      }
    }
  );

  console.log("query", response.config.data, "error", response.data.errors);

  if (response.data.errors) {
    return response.data.errors;
  }

  return response.data.data.insert_solidarity_matches.affected_rows === 1;
};

export default saveMatch;
