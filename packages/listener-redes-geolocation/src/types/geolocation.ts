import { Individual } from './individual'

export interface OpenCageResponse {
  documentation: string,
  licences: [],
  rate: {
    limit: number,
    remaining: number,
    reset: number,
  },
  results: OpenCageResponseResults[]
}

export interface OpenCageResponseResults {
  formatted: string,
  geometry: {
    lat: string,
    lng: string,
  }
}

export interface BrasilApiResponse {
  data: {
    cep: string,
    state: string,
    city: string,
    neighborhood: string,
    street: string,
    service: string,
  }
}

export enum GMAPS_ERRORS {
  REQUEST_FAILED,
  INVALID_INPUT
}

export interface GoogleMapsResponse {
  data: {
    results: GoogleMapsResults[];
    status: string;
  };
}

export interface GoogleMapsResults {
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

export interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  type: string[];
}

export type IndividualGeolocation = Omit<Individual, 'created_at' | 'zipcode'>
