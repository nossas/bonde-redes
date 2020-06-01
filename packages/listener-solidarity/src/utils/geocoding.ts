import dbg from "../dbg";
import axios from "axios";
import { GoogleMapsResponse, IndividualGeolocation, User } from "../types";

const log = dbg.extend("getGeocoding");

export const getGoogleGeolocation = async (address: string, email: string) => {
  const { GOOGLE_MAPS_API_KEY } = process.env;
  try {
    log(`requesting google with address ${address}...`);
    const response: { data: GoogleMapsResponse } = await axios.post(
      "https://maps.googleapis.com/maps/api/geocode/json",
      undefined,
      {
        params: {
          address,
          GOOGLE_MAPS_API_KEY,
        },
      }
    );
    log("google maps responded!");
    return await geolocation(email, address, response.data);
  } catch (e) {
    log(
      `google maps response failed (email, address): '${email}', ${address}`
        .red,
      e
    );
    return await geolocation(email, address, undefined);
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

export const geolocation = (
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

    const i: IndividualGeolocation = {
      latitude: lat.toString(),
      longitude: lng.toString(),
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
  const a = address ? address + "," : "";
  const c = city ? city + "," : "";
  const s = state ? state + "," : "";
  const z = cep ? cep + ",BR" : "";

  return await getGoogleGeolocation(a + c + s + z, email);
};
