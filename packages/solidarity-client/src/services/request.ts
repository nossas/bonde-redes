import Axios from 'axios'

const get = async (route?: any, params?: any) => Axios.get(`/api${route && `/${route}`}`, { params })
const post = async (body: Object) => Axios.post('/api/forward', body)

export default {
  get,
  post
}
