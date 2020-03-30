import { Individual } from './individual'

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

export type IndividualGeolocation = Omit<Individual, 'created_at'| 'zipcode'>

export type ConvertCepRes = IndividualGeolocation | { error: GMAPS_ERRORS }