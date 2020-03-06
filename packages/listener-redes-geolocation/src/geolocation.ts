import axios from 'axios'
import { logger } from './logger'
import { Individual } from './individuals'

export enum GMAPS_ERRORS {
  REQUEST_FAILED,
  INVALID_INPUT
}

interface GoogleMapsResponse {
  data: {
    results: GoogleMapsResults[];
    status: String;
  }
}

interface GoogleMapsResults {
  address_components: GoogleMapsAddressComponent[];
  formatted_address: String;
  geometry: {
    location: {
      lat: String,
      lng: String
    },
  },
  place_id: String,
  types: String[]
}

interface GoogleMapsAddressComponent {
  long_name: String;
  short_name: String;
  type: String[];
}

export const convertCepToAddressWithGoogleApi = async (individualAddress: Record<string, string>): Promise<Individual | boolean | { error: GMAPS_ERRORS }> => {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('Please specify the `JWT_TOKEN` or `HASURA_SECRET` environment variable.')
  }

  const { GOOGLE_MAPS_API_KEY } = process.env
  const cep = individualAddress.zipcode
  let data
  try {
    logger.log('info', `requesting google with cep ${cep}...`)
    const response: GoogleMapsResponse = await axios.post('https://maps.googleapis.com/maps/api/geocode/json', undefined, {
      params: {
        address: cep,
        key: GOOGLE_MAPS_API_KEY,
      },
    })
    logger.log('info', 'response!', response.data)
    data = response.data
  } catch (e) {
    logger.log('error', 'falha na requisição para o google maps')
    return {
      error: GMAPS_ERRORS.REQUEST_FAILED,
    }
  }

  if (data.status === 'OK') {
    const {
      results: [{
        geometry: {
          location: { lat, lng },
        },
        address_components: addressComponents,
        formatted_address: address,
      }],
    } = data

    let state: string | undefined
    let city: string | undefined
    // let country: string | undefined
    // let tagInvalidCep = false

    addressComponents.forEach((
      {
        types,
        short_name: shortName,
      }: { types: string[]; short_name: string },
    ) => {
      if (types.includes('administrative_area_level_1')) {
        state = shortName
      }
      if (types.includes('administrative_area_level_2')) {
        city = shortName
      }
      // if (types.includes('country')) {
      //   country = shortName
      // }
    })

    // if (country !== 'BR') {
    //   state = undefined
    //   city = undefined
    //   tagInvalidCep = true
    // }

    const i: Individual = {
      coordinates: {
        latitude: lat,
        longitude: lng,
      },
      address,
      state,
      city,
    }

    return i;
    // tagInvalidCep,
  }

  return {
    error: GMAPS_ERRORS.INVALID_INPUT,
  }
}
