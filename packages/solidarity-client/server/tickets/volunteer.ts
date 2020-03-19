import { getCurrentDate, getVolunteerType } from "../parse/index";
import volunteerComment from "../comments/volunteer";

type Props = {
  volunteer_user_id: number;
  agent: number;
  volunteer_first_name: string;
  individual_name: string;
  assignee_name: string;
  volunteer_organization_id: number;
  individual_ticket_id: number;
};

export default function volunteerTicket({
  volunteer_user_id,
  agent,
  volunteer_first_name,
  individual_name,
  assignee_name,
  volunteer_organization_id,
  individual_ticket_id
}: Props) {
  return {
    ticket: {
      requester_id: volunteer_user_id,
      submitter_id: agent,
      assignee_id: agent,
      status: "pending",
      subject: `[${
        getVolunteerType(volunteer_organization_id).type
      }] ${volunteer_first_name}`,
      comment: {
        body: volunteerComment({
          volunteer_name: volunteer_first_name,
          individual_name,
          assignee_name
        }),
        author_id: agent,
        public: false
      },
      fields: [
        {
          id: 360016681971,
          value: individual_name
        },
        {
          id: 360016631632,
          value: `https://mapadoacolhimento.zendesk.com/agent/tickets/${individual_ticket_id}`
        },
        {
          id: 360014379412,
          value: "encaminhamento__realizado"
        },
        {
          id: 360017432652,
          value: String(getCurrentDate())
        }
      ]
    }
  };
}
