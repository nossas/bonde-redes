import { thunk, action } from 'easy-peasy'
import request from '../services/request'

interface Foward {
  setError: Function
  setSuccess: Function
  data: {
    volunteer_name: string
    individual_name: string
    individual_ticket_id: number
    agent: number
    volunteer_organization_id: number
    volunteer_registry: string
    volunteer_phone: string
    volunteer_user_id: number
  }
}

const fowardModel = {
  data: {},
  fowardTickets: thunk(async (actions: any, payload: Foward) => {
    const {
      setError,
      setSuccess,
      data
    } = payload
    try {
      console.log(data)
      const response = await request.post(data)
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