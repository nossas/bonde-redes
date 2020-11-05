export interface IndividualCoordinates {
  latitude: string;
  longitude: string;
}

export interface Individual {
  id: number;
  zipcode: string;
  address: string;
  state?: string;
  city?: string;
  coordinates: IndividualCoordinates;
  created_at: string;
}

export type SubscribeIndividual = Pick<
  Individual,
  "zipcode" | "id" | "created_at"
>;

export interface SubscribeIndividualsResponse {
  data: {
    rede_individuals: SubscribeIndividual[];
  };
}
