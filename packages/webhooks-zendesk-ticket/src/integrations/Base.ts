import debug, { Debugger } from 'debug'
import urljoin from 'url-join'
import axios from 'axios'

export enum GMAPS_ERRORS {
  REQUEST_FAILED,
  INVALID_INPUT
}

abstract class Base {
  protected name: string

  protected dbg: Debugger

  protected url: string

  protected organizations: { [s: string]: number }

  private method: 'GET' | 'POST' | 'PUT'

  constructor (name: string, url: string, method: 'GET' | 'POST' | 'PUT' = 'POST') {
    this.method = method
    this.name = `webhooks-zendesk:${name}`
    this.dbg = debug(this.name)
    this.url = url
    const { ZENDESK_ORGANIZATIONS } = process.env
    this.organizations = JSON.parse(ZENDESK_ORGANIZATIONS)
  }

  protected getAddress = async (cep: string) => {
    const log = debug('gmaps')
    const { GOOGLE_MAPS_API_KEY } = process.env
    let data
    try {
      log(`requesting google with cep ${cep}...`)
      const response = await axios.post('https://maps.googleapis.com/maps/api/geocode/json', undefined, {
        params: {
          address: cep,
          key: GOOGLE_MAPS_API_KEY
        }
      })
      log('response!', response.data)
      data = response.data
    } catch (e) {
      this.dbg(`falha na requisição para o google maps`)
      return {
        error: GMAPS_ERRORS.REQUEST_FAILED
      }
    }

    if (data.status === 'OK') {
      const { results: [{
        geometry: {
          location: { lat, lng }
        },
        address_components: addressComponents,
        formatted_address: address
      }] } = data

      let state: string | undefined
      let city: string | undefined
      let country: string | undefined

      addressComponents.forEach(({ types, short_name: shortName }: {types: string[]; short_name: string}) => {
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
      }

      return {
        lat,
        lng,
        address,
        state,
        city
      }
    } else {
      return {
        error: GMAPS_ERRORS.INVALID_INPUT
      }
    }
  }

  protected send = async <T>(page?: string) => {
    const { ZENDESK_API_URL, ZENDESK_API_TOKEN, ZENDESK_API_USER } = process.env
    const endpoint = urljoin(ZENDESK_API_URL!, this.url)
    let result
    try {
      result = await axios.get<T>(endpoint, {
        auth: {
          username: ZENDESK_API_USER,
          password: ZENDESK_API_TOKEN
        },
        params: {
          page
        }
      })
      return result
    } catch (e) {
      this.dbg(JSON.stringify(e.response.data, null, 2))
    }
  }

  abstract start: Function
}

export default Base
