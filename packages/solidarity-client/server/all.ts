import getSolidarityTickets from "./hasura/getSolidarityTickets";
import getSolidarityUsers from "./hasura/getSolidarityUsers";
import { fuseTicketsAndUsers } from "./utils";

const main = async res => {
  const allUsers = await getSolidarityUsers({
    query: `query {
    solidarity_users(
      where: {
      longitude: {_is_null: false},
      latitude: {_is_null: false},
      organization_id: {_is_null: false}
      }
    ) {
      address
      organization_id
      user_id
      atendimentos_concludos_calculado_
      atendimentos_em_andamento_calculado_
      disponibilidade_de_atendimentos
      latitude
      longitude
      email
      encaminhamentos
      encaminhamentos_realizados_calculado_
      name
      phone
      registration_number
      occupation_area
      whatsapp
      data_de_inscricao_no_bonde
      condition
      tipo_de_acolhimento
    }
	}`
  });

  const allTickets = await getSolidarityTickets({
    query: `query {
		solidarity_tickets(
			where: {
				status: {_neq: "deleted"}
			}
		) {
			requester_id
			status_inscricao
			status_acolhimento
			ticket_id
			created_at
			status
			subject
		}
	}`
  });

  const ticketsWithUser = fuseTicketsAndUsers(allUsers, allTickets);

  res.json(ticketsWithUser);
};

export default main;
