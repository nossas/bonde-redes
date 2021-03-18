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

const getGoogleGeolocation = async (cep, key) => {
  try {
    logger.log("info", `requesting google with cep ${cep}...`);
    const response: GoogleMapsResponse = await axios.post(
      "https://maps.googleapis.com/maps/api/geocode/json",
      undefined,
      {
        params: {
          address: cep,
          key
        }
      }
    );
    logger.log("info", "google maps response!", response.data);
    return response.data;
  } catch (e) {
    logger.error("falha na requisição para o google maps", e);
    return e;
  }
};

const getOpenCageGeoLocation = async (
  cep,
  city,
  neighborhood,
  street) => {

  const { GEOCODING_API_KEY } = process.env;
  if (!GEOCODING_API_KEY) {
    throw new Error(
      "Please specify the `GEOCODING_API_KEY` environment variable."
    );
  }

  const apikey = GEOCODING_API_KEY;
  const api_url = 'https://api.opencagedata.com/geocode/v1/json';
  const requestUrl = `${api_url}?key=${apikey}&q=${encodeURIComponent(`${street}, ${neighborhood}, ${city}`)}&pretty=1&no_annotations=1`;

  try {
    logger.log("info", `requesting open cage with complete address ${cep}...`);
    const response: any = await axios.get(requestUrl);
    logger.log("info", `open cage response! ${requestUrl}`);
    return response.data.results;
  } catch (e) {
    logger.error("falha na requisição para o open cage", e);
    return e;
  }
}

const getBrasilApiLocation = async (cep) => {
  try {
    logger.log("info", `requesting Brasil api with cep ${cep}...`);
    const response: BrasilApiResponse = await axios.get(
      `https://brasilapi.com.br/api/cep/v1/${cep}`
    );
    logger.log("info", "Brasil api response!", response);
    return response;
  } catch (e) {
    logger.error("falha na requisição para o Brasil api", e);
    return e;
  }
};

const convertCepToAddressWithGoogleApi = async (
  individual: SubscribeIndividual
): Promise<IndividualGeolocation> => {

  const { GOOGLE_MAPS_API_KEY, BRASIL_API_KEY } = process.env;
  if (!GOOGLE_MAPS_API_KEY && !BRASIL_API_KEY) {
    throw new Error(
      "Please specify the `GOOGLE_MAPS_API_KEY` or `BRASIL_API_KEY` environment variable."
    );
  }

  const cep = individual.zipcode;
  let data;

  if (GOOGLE_MAPS_API_KEY) {
    data = await await getGoogleGeolocation(cep,GOOGLE_MAPS_API_KEY);
  } else {
    data = await await getBrasilApiLocation(cep);
  }

  if (data.statusText === "OK") {
    const {
      cep,
      state,
      city,
      neighborhood,
      street
    } = data.data;

    const geolocation = await getOpenCageGeoLocation(cep,
      city,
      neighborhood,
      street);

    if (geolocation.results > 0) {
      const i: IndividualGeolocation = {
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
    }
  } else if (data.status === "OK") {
    //  handle google response
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
    } = data;

    const [state, city] = getCityAndState(addressComponents);


    const i: IndividualGeolocation = {
      id: individual.id,
      coordinates: {
        latitude: lat.toString(),
        longitude: lng.toString()
      },
      address,
      state,
      city
    };

    logger.log("info", "returned valid individual geolocation data", i);

    return i;
  }

  logger.log(
    "error",
    `google maps return with zero result (id, zipcode): '${individual.id}', ${cep}`
  );

  const i: IndividualGeolocation = {
    id: individual.id,
    coordinates: {
      latitude: "ZERO_RESULTS",
      longitude: "ZERO_RESULTS"
    },
    address: `Cep Incorreto - ${individual.zipcode}`,
    state: "ZERO_RESULTS",
    city: "ZERO_RESULTS"
  };

  return i;
};

export default convertCepToAddressWithGoogleApi;
