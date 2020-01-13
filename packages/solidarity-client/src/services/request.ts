import Axios from 'axios'

const get = async (params?: any) => Axios.get('/api', { params })
const post = async (body: Object) => Axios.post('/api/forward', body)

export default {
  get,
  post
}
