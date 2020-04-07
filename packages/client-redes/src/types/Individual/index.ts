import { Filters } from '../../graphql/FilterQuery'

export type Individual = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string;
  phone: string;
  zipcode: string;
  address: string;
  city: string;
  coordinates: Record<string, string>;
  state: string;
  status: string;
  availability: string;
  extras: Record<string, string>;
  form_entry_id: number;
  group: {
    id: number;
    community_id: number;
    is_volunteer: boolean;
  };
  created_at: string;
  updated_at: string;
};

export type IndividualVars = {
  context: {
    _eq: number;
  };
  filters?: Filters;
  is_volunteer: boolean;
};

export interface IndividualData {
  rede_individuals: Individual[];
}