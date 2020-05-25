import gql from "graphql-tag";
import { client as GraphQLAPI } from "../";
import dbg from "../../dbg";

const log = dbg.extend("insertSolidarityTickets");

const CREATE_TICKETS_MUTATION = gql`
  mutation insert_solidarity_tickets(
    $individuals: [rede_individuals_insert_input!]!
  ) {
    insert_solidarity_tickets(
      objects: $individuals
      on_conflict: {
        constraint: rede_individuals_form_entry_id
        update_columns: [updated_at]
      }
    ) {
      returning {
        id
        first_name
        last_name
        email
        phone
        whatsapp

        extras

        zipcode
        address
        city
        state
        coordinates

        form_entry_id
        rede_group_id

        created_at
        updated_at
      }
    }
  }
`;

type Response = {
  data: {
    insert_solidarity_tickets?: any;
    errors?: Array<any>;
  };
};

const insertSolidarityTickets = async (individuals: any): Promise<Response> => {
  try {
    const res = await GraphQLAPI.mutate({
      mutation: CREATE_TICKETS_MUTATION,
      variables: { individuals },
    });

    if (res && res.data && res.data.errors) {
      return Promise.reject(res.data.errors);
    }

    const {
      data: { insert_solidarity_tickets },
    } = res;

    return Promise.resolve(insert_solidarity_tickets);
  } catch (err) {
    log("failed on insert solidarity tickets: ".red, err);
    return Promise.reject(err);
  }
};

export default insertSolidarityTickets;
