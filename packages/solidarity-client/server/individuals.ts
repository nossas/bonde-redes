import getSolidarityUsers from "./hasura/getSolidarityUsers";
import getSolidarityTickets from "./hasura/getSolidarityTickets";
import { zendeskOrganizations } from "./parse/index";
import { fuseTicketsAndUsers, volunteer_type } from "./utils";

const INDIVIDUAL = zendeskOrganizations.individual;

const main = async (req, res, _next) => {
  const volunteer_organization_id = Number(req.query.volunteer_organization_id);
  const volunteer_tipo_de_acolhimento = volunteer_type(
    volunteer_organization_id
  );
  try {
    const individualUsers = await getSolidarityUsers({
      query: `query ($individual_id: bigint, $volunteer_type: String){
        solidarity_users(
          where: {
            longitude: {_is_null: false},
            latitude: {_is_null: false},
            organization_id: {_eq: $individual_id}
            _or: [
              {tipo_de_acolhimento: { _eq: $volunteer_type }},
              {tipo_de_acolhimento: {_eq: "psicológico_e_jurídico"}}
            ]
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
        individual_id: INDIVIDUAL,
        volunteer_type: volunteer_tipo_de_acolhimento
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
            link_match: {_is_null: true}
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

    // refining tipo_de_acolhimento filters to only return one type at a time
    const ticketsAccordingToVolunteerService = ticketsWithUser.filter(
      t => t.tipo_de_acolhimento === volunteer_tipo_de_acolhimento
    );

    res.json(ticketsAccordingToVolunteerService);
  } catch (e) {
    return e.data.errors && e.data.errors[0];
  }
};

export default main;
