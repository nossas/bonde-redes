import debug, {Debugger} from 'debug'
import urljoin from 'url-join'
import axios from 'axios'

abstract class Base {
  protected name: string
  protected dbg: Debugger
  protected url: string
  protected data: any
  protected organizations: { [s: string]: number }

  constructor(name: string, url: string, data: any) {
    this.name = `webhooks-zendesk:${name}`
    this.dbg = debug(this.name)
    this.url = url
    this.data = data
    const { ZENDESK_ORGANIZATIONS } = process.env
    this.organizations = JSON.parse(ZENDESK_ORGANIZATIONS)
  }

  protected getAddress = async (cep: string) => {
    const { GOOGLE_MAPS_API_KEY } = process.env
    const { data } = await axios.post('https://maps.googleapis.com/maps/api/geocode/json', undefined, {
      params: {
        address: cep,
        key: GOOGLE_MAPS_API_KEY,
      }
    })

    if (data.status === "OK") {
      const { results: [{
        geometry: {
          location: { lat, lng }
        },
        address_components,
        formatted_address: address
      }]} = data

      let state: string | undefined
      let city: string | undefined

      address_components.forEach(({ types, short_name }: {types: string[], short_name: string}) => {
        if (types.includes('administrative_area_level_1')) {
          state = short_name
        }
        if (types.includes('administrative_area_level_2')) {
          city = short_name
        }
      })

      return {
        lat,
        lng,
        address,
        state,
        city
      }
    } else {
      throw new Error(`failed to get lat-lng to cep ${cep}`)
    }
  }

  protected send = async (data: any) => {
    const { ZENDESK_API_URL, ZENDESK_API_TOKEN, ZENDESK_API_USER } = process.env
    const endpoint = urljoin(ZENDESK_API_URL!, this.url)
    try {
      const result = await axios.post(endpoint, data, {
        auth: {
          username: ZENDESK_API_USER,
          password: ZENDESK_API_TOKEN
        }
      })
      this.dbg(`Success created user ${result.data.user.id}`)
      return true
    } catch (e) {
      this.dbg(JSON.stringify(e.response.data, null, 2))
      return false
    }
  }

  abstract start: () => any
}

export default Base
