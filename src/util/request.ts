import Axios from 'axios'
import urljoin from 'url-join'

const get = async (path: string, params?: any) => {
  const { REACT_APP_API_URL } = process.env
  return Axios.get(urljoin(REACT_APP_API_URL!, path), {
    params,
  })
}

export default {
  get,
}
