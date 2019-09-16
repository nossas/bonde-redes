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
