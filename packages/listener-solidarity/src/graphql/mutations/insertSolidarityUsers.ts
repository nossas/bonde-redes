import gql from "graphql-tag";
import { client as GraphQLAPI } from "../";
import dbg from "../../dbg";

const log = dbg.extend("insertSolidarityUsers");

const CREATE_USERS_MUTATION = gql`
  mutation insert_solidarity_users($users: [solidarity_users_insert_input!]!) {
    insert_solidarity_users(
      objects: $users
      on_conflict: {
        constraint: solidarity_users_user_id_key
        update_columns: [
          name
          role
          organization_id
          email
          external_id
          phone
          user_fields
          tipo_de_acolhimento
          condition
          state
          city
          cep
          address
          whatsapp
          registration_number
          occupation_area
          disponibilidade_de_atendimentos
        ]
      }
    ) {
      returning {
        external_id
      }
    }
  }
`;

// type Response = {
//   data: {
//     insert_solidarity_users?: any;
//     errors?: Array<any>;
//   };
// };

const insertSolidarityUsers = async (users: any) => {
  const ids = users.map((u) => u.external_id);
  try {
    const res = await GraphQLAPI.mutate({
      mutation: CREATE_USERS_MUTATION,
      variables: { users },
    });

    if (res && res.data && res.data.errors) {
      log(`failed on insert solidarity users: ${ids}`.red, res.data.errors);
      return undefined;
    }

    const {
      data: {
        insert_solidarity_users: { returning },
      },
    } = res;

    return returning;
  } catch (err) {
    log(`failed on insert solidarity users: ${ids}`.red, err);
    return undefined;
  }
};

export default insertSolidarityUsers;
