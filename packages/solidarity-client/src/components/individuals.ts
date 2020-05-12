import { getSolidarityUsers, getSolidarityTickets } from "../hasura";
import { zendeskOrganizations } from "../parse/index";
import { fuseTicketsAndUsers } from "../utils";

const INDIVIDUAL = zendeskOrganizations.individual;

const main = async (_req, res, _next) => {
  const individualUsers = await getSolidarityUsers({
    query: `query ($individual_id: bigint!){
      solidarity_users(
        where: {
          longitude: {_is_null: false},
          latitude: {_is_null: false},
          organization_id: {_eq: $individual_id}
        }
      )
      {
        organization_id
        user_id
        latitude
        longitude
        email
        name
        phone
        data_de_inscricao_no_bonde
        tipo_de_acolhimento
        address
        id
      }
    }`,
    variables: {
      individual_id: INDIVIDUAL
    }
  });

  const individualTickets = await getSolidarityTickets({
    query: `query {
      solidarity_tickets(
        where: {
          _or: [
            {status: {_eq: "open"}},
            {status: {_eq: "new"}}
          ],
          status_acolhimento: {_eq: "solicitação_recebida"},
          status: {_neq: "deleted"}
        }
      ) {
        status_acolhimento
        status
        subject
        ticket_id
        requester_id
        created_at
        id
      }
    }`
  });

  const ticketsWithUser = fuseTicketsAndUsers(
    individualUsers,
    individualTickets
  );

  res.json(ticketsWithUser);
};

export default main;
