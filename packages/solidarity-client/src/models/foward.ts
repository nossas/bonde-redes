import { thunk, action } from 'easy-peasy'
import request from '../services/request'

interface Foward {
  setError: Function
  setSuccess: Function
  data: Object
}

const data = undefined

const fowardModel = {
  data,
  fowardTickets: thunk(async (actions: any, payload: Foward) => {
    const {
      setError,
      setSuccess,
      data
    } = payload
    console.log(JSON.stringify(data))
    try {
      const response = await request.post(JSON.stringify(data))
      setSuccess(true)
      return response
    }
    catch (err) {
      console.log(err)
      setError({
        status: true,
        message: err && err.message
      })
    }
  }),
  setResponse: action((state, payload) => ({
    ...payload
  })),
};


export default fowardModel