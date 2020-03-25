import axios from "axios";
import { logger } from "./logger";
import { Individual } from "./individuals";

export enum GMAPS_ERRORS {
  REQUEST_FAILED,
  INVALID_INPUT
}

interface GoogleMapsResponse {
  data: {
    results: GoogleMapsResults[];
    status: string;
  };
}

interface GoogleMapsResults {
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

interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  type: string[];
}

const getCityAndState = addressComponents => {
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

export const convertCepToAddressWithGoogleApi = async (
  individual: Individual
): Promise<Individual | boolean | { error: GMAPS_ERRORS }> => {
  const { GOOGLE_MAPS_API_KEY } = process.env;
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "Please specify the `GOOGLE_MAPS_API_KEY` environment variable."
    );
  }

  const cep = individual.zipcode;
  let data;

  try {
    logger.log("info", `requesting google with cep ${cep}...`);
    const response: GoogleMapsResponse = await axios.post(
      "https://maps.googleapis.com/maps/api/geocode/json",
      undefined,
      {
        params: {
          address: cep,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );
    logger.log("info", "response!", response.data);
    data = response.data;
  } catch (e) {
    logger.log("error", "falha na requisição para o google maps");
    return {
      error: GMAPS_ERRORS.REQUEST_FAILED
    };
  }

  if (data.status === "ZERO_RESULTS") {
    logger.log(
      "error",
      `google maps return with zero result (id, zipcode): ${individual.id}, ${cep}`
    );

    const i: Individual = {
      id: individual.id,
      coordinates: {
        latitude: "ZERO_RESULTS",
        longitude: "ZERO_RESULTS"
      },
      address: `Cep Incorreto - ${individual.zipcode}`,
      state: "ZERO_RESULTS",
      city: "ZERO_RESULTS"
    };

    return {
      error: GMAPS_ERRORS.INVALID_INPUT,
      ...i
    };
  } else if (data.status === "OK") {
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

    const i: Individual = {
      id: individual.id,
      coordinates: {
        latitude: lat.toString(),
        longitude: lng.toString()
      },
      address,
      state,
      city
    };

    return i;
  }

  return {
    error: GMAPS_ERRORS.INVALID_INPUT
  };
};
