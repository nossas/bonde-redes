import axios from "axios";
import { logger } from "./logger";
import { SubscribeIndividual } from "./types/individual";
import { 
  GoogleMapsResponse, 
  IndividualGeolocation
} from './types/geolocation'

const getCityAndState = (addressComponents): Array<string> => {
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
    return e
  }
}

const convertCepToAddressWithGoogleApi = async (
  individual: SubscribeIndividual
): Promise<IndividualGeolocation> => {
  const { GOOGLE_MAPS_API_KEY } = process.env;
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "Please specify the `GOOGLE_MAPS_API_KEY` environment variable."
    );
  }

  const cep = individual.zipcode;
  const data = await getGoogleGeolocation(cep, GOOGLE_MAPS_API_KEY) 

  if (data.status === "ZERO_RESULTS") {
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

    return i
  } if (data.status === "OK") {
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

  return undefined
};

export default convertCepToAddressWithGoogleApi