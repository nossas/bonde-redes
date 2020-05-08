import { Client } from "@googlemaps/google-maps-services-js";
import dbg from "./dbg";

const log = dbg.extend("openStateFile");

type LatLng = {
  latitude: string | null;
  longitude: string | null;
  address: string | null;
};

const getLatLng = async (cep: string): Promise<LatLng> => {
  const client = new Client({});

  try {
    const search = await client.geocode({
      params: {
        address: `${cep},BR`,
        key: process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 1000 // milliseconds
    });

    const results = search.data.results[0];
    const geometry = results && results.geometry && results.geometry.location;
    const address = results && results.formatted_address;

    return {
      latitude: geometry.lat.toString(),
      longitude: geometry.lng.toString(),
      address
    };
  } catch (e) {
    log(e);
    return {
      latitude: null,
      longitude: null,
      address: null
    };
  }
};

export default getLatLng;
