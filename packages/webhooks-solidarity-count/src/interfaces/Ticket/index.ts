import dicio from "./dicio";

export type status_acolhimento_values =
  | "atendimento__concluído"
  | "atendimento__iniciado"
  | "atendimento__interrompido"
  | "encaminhamento__aguardando_confirmação"
  | "encaminhamento__confirmou_disponibilidade"
  | "encaminhamento__negado"
  | "encaminhamento__realizado"
  | "encaminhamento__realizado_para_serviço_público"
  | "solicitação_recebida";

export type ticketCustomFields = Array<
  | {
      id: keyof typeof dicio;
      value: string | null;
    }
  | { id: 360014379412; value: status_acolhimento_values }
>;

export interface TicketZendesk {
  id: number;
  ticket_id?: number;
  assignee_id: number;
  created_at: string;
  custom_fields: ticketCustomFields;
  description: string;
  group_id: number;
  organization_id: number;
  raw_subject: string;
  requester_id: number;
  status: string;
  subject: string;
  submitter_id: number;
  tags: string[];
  updated_at: string;
  community_id: number;
}

export type customFields = {
  status_acolhimento: status_acolhimento_values | null;
  nome_voluntaria: string | null;
  link_match: string | null;
  nome_msr: string | null;
  data_inscricao_bonde: string | null;
  data_encaminhamento: string | null;
  status_inscricao: string | null;
  telefone: string | null;
  estado: string | null;
  cidade: string | null;
};

type TicketHasuraType = TicketZendesk & customFields;

export interface TicketHasuraIn extends Omit<TicketHasuraType, "id"> {
  ticket_id: number;
}
