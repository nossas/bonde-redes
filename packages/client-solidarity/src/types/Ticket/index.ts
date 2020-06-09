type Ticket = {
  tipo_de_acolhimento: string;
  status_inscricao: string;
  status_acolhimento: string;
  ticket_status: string;
  ticket_id: number;
  ticket_created_at: string;
  latitude: string;
  longitude: string;
  name: string;
  email: string;
  data_de_inscricao_no_bonde?: string;
  user_id: number;
  condition: string;
  organization_id: number;
  whatsapp: string;
  registration_number: string;
  phone: string;
};

export default Ticket;
