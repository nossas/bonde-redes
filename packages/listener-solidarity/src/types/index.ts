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
export interface User {
  role: "end-user";
  organization_id: number;
  name: string;
  email: string;
  external_id: string;
  phone: string | null;
  user_fields: {
    condition: "inscrita" | "desabilitada";
    state: string;
    city: string;
    neighborhood: string;
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
  };
}

interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  type: string[];
}

interface GoogleMapsResults {
  address_components: GoogleMapsAddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: string;
      lng: string;
    };
  };
  place_id: string;
  types: string[];
}

export interface GoogleMapsResponse {
  data: {
    results: GoogleMapsResults[];
    status: string;
  };
}

export type IndividualGeolocation = {
  cep: string;
  address: string;
  state: string;
  city: string;
  latitude: string;
  longitude: string;
};

export interface MetaField {
  uid: string;
  name: string;
}

export type Entries = {
  fields: string;
  widget_id: number;
  id: number;
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
  neighborhood?: string;
  cep?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  registration_number?: string;
  occupation_area?: string;
  disponibilidade_de_atendimentos?: string;
};
