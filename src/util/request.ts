import Axios from 'axios'

const get = async (params?: any) => Axios.get('/api', { params })

export default {
  get,
}
