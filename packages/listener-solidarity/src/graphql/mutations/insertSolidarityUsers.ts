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
          address
          cep
          city
          community_id
          condition
          cor
          disponibilidade_de_atendimentos
          created_at
          data_de_inscricao_no_bonde
          email
          external_id
          latitude
          longitude
          name
          occupation_area
          organization_id
          phone
          registration_number
          role
          state
          tags
          tipo_de_acolhimento
          ultima_atualizacao_de_dados
          updated_at
          user_fields
          user_id
          whatsapp
        ]
      }
    ) {
      affected_rows
    }
  }
`;

type Response = {
  data: {
    insert_solidarity_users?: any;
    errors?: Array<any>;
  };
};

const insertSolidarityUsers = async (users: any): Promise<Response> => {
  try {
    const res = await GraphQLAPI.mutate({
      mutation: CREATE_USERS_MUTATION,
      variables: { users },
    });

    if (res && res.data && res.data.errors) {
      return Promise.reject(res.data.errors);
    }

    const {
      data: { insert_solidarity_users },
    } = res;

    log(insertSolidarityUsers);

    return Promise.resolve(insert_solidarity_users);
  } catch (err) {
    log("failed on insert solidarity users: ".red, err);
    return Promise.reject(err);
  }
};

export default insertSolidarityUsers;
