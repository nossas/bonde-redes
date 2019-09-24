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

  constructor (name: string) {
    this.name = `webhooks-zendesk:${name}`
    this.dbg = debug(this.name)
  }

  protected get = async <T>(url: string, params?: any) => {
    const { ZENDESK_API_URL, ZENDESK_API_TOKEN, ZENDESK_API_USER } = process.env
    const endpoint = urljoin(ZENDESK_API_URL!, url)
    let result
    try {
      result = await axios.get<T>(endpoint, {
        auth: {
          username: ZENDESK_API_USER,
          password: ZENDESK_API_TOKEN
        },
        params
      })
      return result
    } catch (e) {
      this.dbg(JSON.stringify(e.response.data, null, 2))
    }
  }

  protected put = async <T>(url: string, data?: any) => {
    const { ZENDESK_API_URL, ZENDESK_API_TOKEN, ZENDESK_API_USER } = process.env
    const endpoint = urljoin(ZENDESK_API_URL!, url)
    let result
    try {
      result = await axios.put<T>(endpoint, data, {
        auth: {
          username: ZENDESK_API_USER,
          password: ZENDESK_API_TOKEN
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
