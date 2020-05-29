import dbg from "../dbg";
import axios from "axios";
import { GoogleMapsResponse, IndividualGeolocation } from "../types";

const log = dbg.extend("getGeocoding");

const getCityAndState = (addressComponents): Array<string> => {
  let state = "";
  let city = "";
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

const getGoogleGeolocation = async (address, key) => {
  try {
    log(`requesting google with address ${address}...`);
    const response: GoogleMapsResponse = await axios.post(
      "https://maps.googleapis.com/maps/api/geocode/json",
      undefined,
      {
        params: {
          address,
          key
        }
      }
    );
    log("google maps responded!");
    return response.data;
  } catch (e) {
    log("failed google maps response", e);
    return e;
  }
};

export default async ({
  state = "",
  city = "",
  cep = "",
  address = "",
  email = ""
}): Promise<IndividualGeolocation> => {
  const { GOOGLE_MAPS_API_KEY } = process.env;

  const a = address ? address + "," : "";
  const c = city ? city + "," : "";
  const s = state ? state + "," : "";
  const z = cep ? cep + ",BR" : "";
  const compose = a + c + s + z;

  const data = await getGoogleGeolocation(compose, GOOGLE_MAPS_API_KEY);

  if (data.status === "OK") {
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
      latitude: lat.toString(),
      longitude: lng.toString(),
      address,
      state,
      city,
      cep
    };

    // log(i);

    log("returned valid individual geolocation data");

    return i;
  }

  if (data.status === "ZERO_RESULTS") {
    log(
      `google maps return with zero result (email, zipcode): '${email}', ${compose}`
    );
  }

  const i: IndividualGeolocation = {
    latitude: "ZERO_RESULTS",
    longitude: "ZERO_RESULTS",
    address: `Cep Incorreto - ${cep}`,
    state: "ZERO_RESULTS",
    city: "ZERO_RESULTS",
    cep
  };

  return i;
};
