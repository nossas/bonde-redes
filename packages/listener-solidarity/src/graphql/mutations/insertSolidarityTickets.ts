import gql from "graphql-tag";
import { client as GraphQLAPI } from "../";
import dbg from "../../dbg";

const log = dbg.extend("insertSolidarityTickets");

const CREATE_TICKETS_MUTATION = gql`
  mutation createSolidarityTicket($ticket: solidarity_tickets_insert_input!) {
    insert_solidarity_tickets_one(
      object: $ticket
      on_conflict: {
        constraint: solidarity_tickets_ticket_id_key
        update_columns: [
          created_at
          description
          ticket_id
          organization_id
          raw_subject
          requester_id
          status
          subject
          submitter_id
          tags
          updated_at
          community_id
          custom_fields
          data_inscricao_bonde
          status_acolhimento
          nome_msr
        ]
      }
    ) {
      ticket_id
    }
  }
`;

// type Response = {
//   data: {
//     insert_solidarity_tickets_one?: {
//       affected_rows: number;
//       returning: {
//         ticket_id: number;
//       };
//     };
//     errors?: Array<any>;
//   };
// };

const insertSolidarityTickets = async (ticket) => {
  try {
    const res = await GraphQLAPI.mutate({
      mutation: CREATE_TICKETS_MUTATION,
      variables: { ticket },
    });

    if (res && res.data && res.data.errors) {
      log("failed on insert solidarity tickets: ".red, res.data.errors);
      return undefined;
    }

    const {
      data: { insert_solidarity_tickets_one },
    } = res;

    log({ returning: insert_solidarity_tickets_one });

    return (
      insert_solidarity_tickets_one && insert_solidarity_tickets_one.ticket_id
    );
  } catch (err) {
    log("failed on insert solidarity tickets: ".red, err);
    return undefined;
  }
};

export default insertSolidarityTickets;
