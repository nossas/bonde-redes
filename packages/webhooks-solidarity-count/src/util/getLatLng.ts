import dbg from "./dbg";

const log = dbg.extend("getLatLng");

type LatLng = {
  latitude: string | null;
  longitude: string | null;
  address: string | null;
};

const getLatLng = async (
  cep: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maps: (cep: string) => Promise<any>
): Promise<LatLng> => {
  try {
    const search: {
      data: {
        results: Array<{
          geometry: { location: { lat: number; lng: number } };
          formatted_address;
        }>;
      };
    } = await maps(cep);

    const {
      geometry: { location },
      formatted_address
    } = search.data.results[0];
    const address = formatted_address ? formatted_address : "";

    if (!(location && location.lat && location.lng)) {
      throw new Error("No geolocation in Google Maps response");
    }

    return {
      address,
      latitude: location.lat ? location.lat.toString() : "",
      longitude: location.lat ? location.lng.toString() : ""
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
