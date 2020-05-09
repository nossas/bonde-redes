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
  return maps(cep)
    .then(
      ({
        data
      }: {
        data: {
          results: Array<{
            geometry: { location: { lat: number; lng: number } };
            formatted_address;
          }>;
        };
      }) => {
        if (data && data.results.length > 0) {
          const {
            geometry: { location },
            formatted_address
          } = data.results[0];
          const address = formatted_address ? formatted_address : "";

          if (!(location && location.lat && location.lng)) {
            throw new Error("No geolocation in Google Maps response");
          }

          return {
            address,
            latitude: location.lat ? location.lat.toString() : "",
            longitude: location.lat ? location.lng.toString() : ""
          };
        }
        throw new Error("No data returned from Google Maps response");
      }
    )
    .catch(e => {
      log(e);
      return {
        latitude: null,
        longitude: null,
        address: null
      };
    });
};

export default getLatLng;
