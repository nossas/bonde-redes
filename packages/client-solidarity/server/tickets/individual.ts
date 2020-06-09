import { getCurrentDate, getVolunteerType } from "../parse/index";
import individualComment from "../comments/individual";

type Props = {
  match_ticket_id: number;
  agent: string;
  volunteer_name: string;
  volunteer_organization_id: number;
  volunteer_first_name: string;
  volunteer_registry: string;
  volunteer_phone: string;
  assignee_name: string;
  individual_name: string;
};

export default function individualTicket({
  match_ticket_id,
  agent,
  volunteer_name,
  volunteer_organization_id,
  volunteer_first_name,
  volunteer_registry,
  volunteer_phone,
  assignee_name,
  individual_name
}: Props) {
  return {
    ticket: {
      status: "pending",
      assignee_id: agent,
      fields: [
        {
          id: 360016631592,
          value: volunteer_name
        },
        {
          id: 360014379412,
          value: "encaminhamento__realizado"
        },
        {
          id: 360016631632,
          value: `https://mapadoacolhimento.zendesk.com/agent/tickets/${match_ticket_id}`
        },
        {
          id: 360017432652,
          value: String(getCurrentDate())
        }
      ],
      comment: {
        body: individualComment({
          volunteer_type: getVolunteerType(volunteer_organization_id),
          volunteer: {
            name: volunteer_first_name,
            registry: volunteer_registry,
            tel: volunteer_phone
          },
          assignee_name,
          individual_name
        }),
        author_id: agent,
        public: true
      }
    }
  };
}
