import gql from "graphql-tag";
import * as yup from "yup";
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
          updated_at
          external_id
          custom_fields
          description
          organization_id
          subject
          status
          submitter_id
          tags
          ticket_id
          community_id
          requester_id
          status_acolhimento
          nome_voluntaria
          link_match
          nome_msr
          data_inscricao_bonde
          data_encaminhamento
          status_inscricao
          telefone
          estado
          cidade
          atrelado_ao_ticket
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

const schema = yup.object().shape({
  external_id: yup.number().required(),
  created_at: yup.string().required(),
  custom_fields: yup.array().of(
    yup.object().shape({
      id: yup.number(),
      value: yup.string().nullable(),
    })
  ),
  description: yup.string().required(),
  organization_id: yup.number().required(),
  subject: yup.string().required(),
  status: yup.string().required(),
  ticket_id: yup.number().required(),
  community_id: yup.number().required(),
  requester_id: yup.number().required(),
  status_acolhimento: yup.string().required(),
  submitter_id: yup.number().required(),
  data_inscricao_bonde: yup.string().required(),
  nome_voluntaria: yup.string().nullable(),
  link_match: yup.string().nullable(),
  nome_msr: yup.string().nullable(),
  data_encaminhamento: yup.string().nullable(),
  status_inscricao: yup.string().nullable(),
  telefone: yup.string().nullable(),
  estado: yup.string().nullable(),
  cidade: yup.string().nullable(),
  atrelado_ao_ticket: yup.number().nullable(),
  updated_at: yup.string(),
  tags: yup.mixed(),
});

const insertSolidarityTickets = async (ticket) => {
  log(`Saving ticket '${ticket.id}' in Hasura...`);
  try {
    const validatedTicket = await schema.validate(ticket, {
      stripUnknown: true,
    });
    // log(validatedTicket);
    const res = await GraphQLAPI.mutate({
      mutation: CREATE_TICKETS_MUTATION,
      variables: { ticket: validatedTicket },
    });

    if (res && res.data && res.data.errors) {
      log("failed on insert solidarity tickets: ".red, res.data.errors);
      return undefined;
    }

    const {
      data: { insert_solidarity_tickets_one },
    } = res;

    // log({ returning: insert_solidarity_tickets_one });

    return (
      insert_solidarity_tickets_one && insert_solidarity_tickets_one.ticket_id
    );
  } catch (err) {
    log("failed on insert solidarity tickets: ".red, err);
    return undefined;
  }
};

export default insertSolidarityTickets;
