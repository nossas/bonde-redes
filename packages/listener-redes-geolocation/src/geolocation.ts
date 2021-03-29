import axios from "axios";
import { logger } from "./logger";
import { SubscribeIndividual } from "./types/individual";
import { GoogleMapsResponse, IndividualGeolocation, BrasilApiResponse } from "./types/geolocation";

const getCityAndState = (addressComponents): Array<string | undefined> => {
  let state: string | undefined;
  let city: string | undefined;
  // let country: string | undefined

  addressComponents.forEach(
    ({
      types,
      short_name: shortName
    }: {
      types: string[];
      short_name: string;
    }) => {
      if (types.includes("administrative_area_level_1")) {
        state = shortName;
      }
      if (types.includes("administrative_area_level_2")) {
        city = shortName;
      } else if (types.includes("locality")) {
        city = shortName;
      }

      // if (types.includes('country')) {
      //   country = shortName
      // }
    }
  );

  // if (country !== 'BR') {
  //   state = undefined
  //   city = undefined
  // }

  return [state, city];
};

const getGoogleGeolocation = async (individual: SubscribeIndividual, key) => {
  try {
    logger.log("info", `requesting google with cep ${individual.zipcode}...`);

    const response: GoogleMapsResponse = await axios.post(
      "https://maps.googleapis.com/maps/api/geocode/json",
      undefined,
      {
        params: {
          address: individual.zipcode,
          key
        }
      }
    );

    logger.log("info", "google maps response!", response.data);

    if (response.data.status !== "OK") {
      return false
    }

    const {
      results: [
        {
          geometry: {
            location: { lat, lng }
          },
          address_components: addressComponents,
          formatted_address: address
        }
      ]
    } = response.data;

    const [state, city] = getCityAndState(addressComponents);

    const i = {
      id: individual.id,
      coordinates: {
        latitude: lat.toString(),
        longitude: lng.toString()
      },
      address,
      state,
      city
    };

    logger.log("info", "returned valid individual geolocation data with google", i);

    return i;
    // return response.data;
  } catch (e) {
    logger.error("falha na requisição para o google maps", e);
    return e;
  }
};

const getOpenCageGeoLocation = async (
  cep,
  city,
  neighborhood,
  street,
  GEOCODING_API_KEY) => {

  const api_url = 'https://api.opencagedata.com/geocode/v1/json';
  const requestUrl = `${api_url}?key=${GEOCODING_API_KEY}&q=${encodeURIComponent(`${street}, ${neighborhood}, ${city}`)}&pretty=1&no_annotations=1`;

  try {
    logger.log("info", `requesting open cage with complete address ${cep}...`);
    const response: any = await axios.get(requestUrl);
    logger.log("info", `open cage response! ${requestUrl}`);
    return (response.data.results.length > 0) ? response.data.results : false;
  } catch (e) {
    logger.error("falha na requisição para o open cage", e);
    return e;
  }
}

const getBrasilApiLocation = async (individual, GEOCODING_API_KEY) => {
  try {
    logger.log("info", `requesting Brasil api with cep ${individual.zipcode}...`);
    const response: BrasilApiResponse = await axios.get(
      `https://brasilapi.com.br/api/cep/v1/${individual.zipcode}`
    );
    logger.log("info", "Brasil api response!", response);

    const {
      cep,
      state,
      city,
      neighborhood,
      street
    } = response.data;

    const geolocation = await getOpenCageGeoLocation(cep,
      city,
      neighborhood,
      street,
      GEOCODING_API_KEY);

    const i = {
      id: individual.id,
      coordinates: {
        latitude: geolocation[0].geometry.lat.toString(),
        longitude: geolocation[0].geometry.lng.toString(),
      },
      address: geolocation[0].formatted,
      state,
      city
    };

    logger.log("info", "returned valid individual geolocation data", i);

    return i;
  } catch (e) {
    logger.error("falha na requisição para o Brasil api", e);
    return e;
  }
};

const convertCepToAddressWithGoogleApi = async (
  individual: SubscribeIndividual
): Promise<IndividualGeolocation> => {

  const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
  const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY || '';

  if (GOOGLE_MAPS_API_KEY.length > 0) {
    return await getGoogleGeolocation(individual, GOOGLE_MAPS_API_KEY);
  } else if (GEOCODING_API_KEY.length > 0) {
    return await getBrasilApiLocation(individual, GEOCODING_API_KEY);
  }

  return {
    id: individual.id,
    coordinates: {
      latitude: "ZERO_RESULTS",
      longitude: "ZERO_RESULTS"
    },
    address: `Cep Incorreto - ${individual.zipcode}`,
    state: "ZERO_RESULTS",
    city: "ZERO_RESULTS"
  };
};

export default convertCepToAddressWithGoogleApi;
