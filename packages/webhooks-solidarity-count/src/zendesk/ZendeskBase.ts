import urljoin from 'url-join'
import axios from 'axios'
import dbg from './dbg'

const log = dbg.extend('base')

const get = async <T>(url: string, params?: any) => {
  const { ZENDESK_API_URL, ZENDESK_API_TOKEN, ZENDESK_API_USER } = process.env
  const endpoint = urljoin(ZENDESK_API_URL, url)
  try {
    return await axios.get<T>(endpoint, {
      auth: {
        username: ZENDESK_API_USER,
        password: ZENDESK_API_TOKEN,
      },
      params,
    })
  } catch (e) {
    return log(e.response.data)
  }
}

const put = async <T>(url: string, data?: any) => {
  const { ZENDESK_API_URL, ZENDESK_API_TOKEN, ZENDESK_API_USER } = process.env
  const endpoint = urljoin(ZENDESK_API_URL!, url)
  try {
    return await axios.put<T>(endpoint, data, {
      auth: {
        username: ZENDESK_API_USER,
        password: ZENDESK_API_TOKEN,
      },
    })
  } catch (e) {
    return log(e)
  }
}

export default { get, put }
