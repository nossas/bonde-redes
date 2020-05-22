import gql from "graphql-tag";
import { client as GraphQLAPI } from "../";
import dbg from "../../dbg";

const log = dbg.extend("insertSolidarityUsers");

const SOLIDARITY_USERS_MUTATION = gql`
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

const insertSolidarityUsers = async (users: any): Promise<any> => {
  try {
    const {
      data: { insert_solidarity_users },
    } = await GraphQLAPI.mutate({
      mutation: SOLIDARITY_USERS_MUTATION,
      variables: { users },
    });

    log(insertSolidarityUsers);

    return insert_solidarity_users;
  } catch (err) {
    log("failed on insert solidarity users: ".red, err);
    return undefined;
  }
};

export default insertSolidarityUsers;
