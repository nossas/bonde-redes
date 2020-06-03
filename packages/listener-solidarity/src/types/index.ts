interface Settings {
  id: number;
  settings: any;
  community_id: number;
}

interface SettingsDataResponse {
  rede_settings: Settings[];
}

export interface SettingsResponse {
  data: SettingsDataResponse;
}

export interface Widget {
  id: number;
  organization_id: number;
  metadata: {
    form_mapping: Array<{ uid: string; name: string }>;
  };
}

// Zendesk + Hasura fields to create user
export type User = {
  role: "end-user";
  organization_id: number;
  name: string;
  email: string;
  external_id: string;
  phone: string;
  user_id?: number;
  verified: boolean;
  user_fields: {
    condition: "inscrita" | "desabilitada";
    state: string;
    city: string;
    cep: string;
    address: string;
    tipo_de_acolhimento:
      | "jurídico"
      | "psicológico"
      | "psicológico_e_jurídico"
      | null;
    whatsapp: string | null;
    registration_number: string | null;
    occupation_area: string | null;
    disponibilidade_de_atendimentos: string | null;
    data_de_inscricao_no_bonde: string;
  };
};

interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleMapsResults {
  address_components: GoogleMapsAddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address?: string;
}

export type GoogleMapsResponse = {
  results: GoogleMapsResults[];
  status: string;
  error_message?: string;
};

export type IndividualGeolocation = {
  cep: string;
  address: string;
  state: string;
  city: string;
  latitude: string;
  longitude: string;
};

// Fields that come from BONDE widget
export type Instance = {
  first_name: string;
  email: string;
  extras?: {
    accept_terms?: "sim" | "não";
  };
  tipo_de_acolhimento:
    | "jurídico"
    | "psicológico"
    | "psicológico_e_jurídico"
    | null;
  last_name?: string;
  state?: string;
  city?: string;
  cep?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  registration_number?: string;
  occupation_area?: string;
  disponibilidade_de_atendimentos?: string;
};

export type Ticket = {
  comment: {
    body: string;
  };
  id: number;
  subject: string;
  external_id: string;
  requester_id: number;
  custom_fields: Array<{ id: number; value: any }>;
  created_at: string;
  description: string;
  ticket_id: number;
  organization_id: number;
  raw_subject: string;
  status: string;
  submitter_id: number;
  tags: Array<string>;
  updated_at: string;
  community_id: number;
  data_inscricao_bonde: string;
  status_acolhimento: string;
  nome_msr: string;
  cidade: string | null;
  estado: string | null;
  link_match: string | null;
  nome_voluntaria: string | null;
  status_inscricao: string | null;
  telefone: string | null;
};

export type Fields = Array<{
  uid: string;
  kind: string;
  label: string;
  placeholder: string;
  required: "true" | "false";
  value: string;
}>;

export type FormEntry = {
  fields: string;
  id: number;
  widget_id: number;
  cached_community_id: number;
  created_at: string;
};
