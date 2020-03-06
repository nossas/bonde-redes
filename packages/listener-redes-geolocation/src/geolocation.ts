import axios from 'axios'
import { logger } from './logger'

export enum GMAPS_ERRORS {
  REQUEST_FAILED,
  INVALID_INPUT
}

interface GeoLocationResponse {
  data: {
    form_entries: Record<string, string>[]
  }
}

export const geolocation = () => async (response: GeoLocationResponse): Promise<Record<string, string>[]> => {
  const { data: { form_entries: entries } } = response

	entries.forEach((formEntry: Record<string, string>) => {
    return formEntry
	})

  return entries
};

export const convertCepToAddressWithGoogleApi = async (cep: string): Promise<Record<string,string | boolean | GMAPS_ERRORS>> => {
    const { GOOGLE_MAPS_API_KEY } = process.env
    let data
    try {
      logger.log('info', `requesting google with cep ${cep}...`)
      const response = await axios.post('https://maps.googleapis.com/maps/api/geocode/json', undefined, {
        params: {
          address: cep,
          key: GOOGLE_MAPS_API_KEY,
        },
      })
      logger.log('info', 'response!', response.data)
      data = response.data
    } catch (e) {
      this.dbg('falha na requisição para o google maps')
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
      let country: string | undefined
      let tagInvalidCep = false

      addressComponents.forEach((
        {
          types,
          short_name: shortName,
        }: {types: string[]; short_name: string},
      ) => {
        if (types.includes('administrative_area_level_1')) {
          state = shortName
        }
        if (types.includes('administrative_area_level_2')) {
          city = shortName
        }
        if (types.includes('country')) {
          country = shortName
        }
      })

      if (country !== 'BR') {
        state = undefined
        city = undefined
        tagInvalidCep = true
      }

      return {
        lat,
        lng,
        address,
        state,
        city,
        tagInvalidCep,
      }
    }

    return {
      error: GMAPS_ERRORS.INVALID_INPUT,
    }
  }
