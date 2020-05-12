import dicioAgent from "../pages/Match/Table/dicioAgent";
import { Ticket } from "../models/table-data";

type Props = {
  user: string | number;
  data: Ticket[];
  filterBy: "user_id" | "email";
};

export const getUserData = ({ user, data, filterBy }: Props) =>
  data.filter((i: Ticket) => user === i[filterBy])[0];

export const encodeText = (input: string) => encodeURIComponent(input);

type Text = {
  volunteer_name: string;
  individual_name: string;
  agent: string;
};
export const whatsappText = ({
  volunteer_name,
  individual_name,
  agent
}: Text) => {
  return `*${volunteer_name}, DEU MATCH* 🤝🏽 O seu número de atendimento acaba de ser enviado para a ${individual_name}! Esperamos que  ela entre em contato com você. Infelizmente, sabemos o quão difícil é dar esse passo e pode ser que ela não a procure. Ela possui 30 dias para entrar em contato, caso isso não aconteça dentro desse período, liberaremos a vaga para outra mulher. \n\n*Não se esqueça de nos avisar quando começar a atendê-la. Lembre que os atendimentos devem ser integralmente gratuitos.* \n\n Para te auxiliar, acesse a nossa cartilha com informações fundamentais sobre o acolhimento a mulheres em situação de violência. Acabamos de enviá-la por e-mail. \n\n Qualquer dúvida ou dificuldade, por favor nos comunique. \n Obrigada! É muito bom saber que podemos contar com você 💜\n Um abraço, \n ${agent} do Mapa do Acolhimento.`;
};

export const parseNumber = (input: string) => input.replace(/\D/g, "");

export const emailValidation = () =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export const zendeskOrganizations = JSON.parse(
  process.env.REACT_APP_ZENDESK_ORGANIZATIONS || "{}"
);

export const isVolunteer = (organization_id: number) =>
  [zendeskOrganizations.therapist, zendeskOrganizations.lawyer].includes(
    organization_id
  );

export const getAgentName = (agent: number) => dicioAgent[agent];

export const volunteer_category = (input: number) => {
  if (input === zendeskOrganizations.lawyer) return "jurídico";
  if (input === zendeskOrganizations.therapist) return "psicológico";
};

const LAWYER = zendeskOrganizations.lawyer;
const THERAPIST = zendeskOrganizations.therapist;

export const getVolunteerType = (id: number) => {
  if (id === LAWYER) return "Advogada";
  if (id === THERAPIST) return "Psicóloga";
  throw new Error("Volunteer organization_id not supported in search for type");
};
