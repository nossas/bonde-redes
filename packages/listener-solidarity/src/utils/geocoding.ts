import dbg from "../dbg";
import axios from "axios";
import { GoogleMapsResponse, IndividualGeolocation, User } from "../types";

const log = dbg.extend("getGeocoding");

export const getGoogleGeolocation = async (address: string, email: string) => {
  try {
    log(`requesting google with address ${address}...`);
    const response: { data: GoogleMapsResponse } = await axios.post(
      "https://maps.googleapis.com/maps/api/geocode/json",
      undefined,
      {
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    log("google maps responded!");

    if (response.data && response.data.error_message) {
      log(
        `google maps response failed (email, address): '${email}', ${address}`
          .red,
        response.data.error_message
      );
      return processGeolocation(email, address, undefined);
    }

    return processGeolocation(email, address, response.data);
  } catch (e) {
    log(
      `google maps response failed (email, address): '${email}', ${address}`
        .red,
      e
    );
    return processGeolocation(email, address, undefined);
  }
};

const getCityStateAndZipcode = (addressComponents): Array<string> => {
  let state = "";
  let city = "";
  let zipcode = "";
  // let country: string | undefined

  addressComponents.forEach(
    ({
      types,
      short_name: shortName,
    }: {
      types: string[];
      short_name: string;
    }) => {
      if (types.includes("postal_code")) {
        zipcode = shortName;
      }
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

  return [state, city, zipcode];
};

export const processGeolocation = (
  userEmail: string,
  searchAddress: string,
  data?: GoogleMapsResponse
) => {
  if (data && data.status === "OK") {
    const {
      results: [
        {
          geometry: {
            location: { lat = "", lng = "" },
          },
          address_components: addressComponents,
          formatted_address: address = "",
        },
      ],
    } = data;

    const [state, city, zipcode] = getCityStateAndZipcode(addressComponents);
    const latitude = typeof lat === "string" ? lat : lat.toFixed(3);
    const longitude = typeof lng === "string" ? lng : lng.toFixed(3);
    const i: IndividualGeolocation = {
      latitude,
      longitude,
      address,
      state,
      city,
      cep: zipcode,
    };

    // log(i);

    log("returned valid individual geolocation data");

    return i;
  }

  if (data && data.status === "ZERO_RESULTS") {
    log(
      `google maps return with zero result (email, address): '${userEmail}', ${searchAddress}`
    );
  }

  const i: IndividualGeolocation = {
    latitude: "ZERO_RESULTS",
    longitude: "ZERO_RESULTS",
    address: `Endereço não encontrado - ${searchAddress}`,
    state: "ZERO_RESULTS",
    city: "ZERO_RESULTS",
    cep: "ZERO_RESULTS",
  };

  return i;
};

export default async ({ state, city, cep, address, email }: any) => {
  const a = address ? `${address},` : "";
  const c = city ? `${city},` : "";
  const s = state ? `${state},` : "";
  const z = cep ? cep + ",BR" : "";

  return await getGoogleGeolocation(a + c + s + z, email);
};
