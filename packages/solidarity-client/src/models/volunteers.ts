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

const volunteersModel = {
  getAvailableVolunteers: thunk(async (actions: any, payload: Foward) => {
    try {
      const res = await request.get('volunteers')
      console.log({res})
      actions.setVolunteers(res.data)
    }
    catch (err) {
      console.log(err)
      actions.setError({
        status: true,
        message: err && err.message
      })
    }
  }),
  volunteers: [],
  setVolunteers: action((state, payload) => ({
    volunteers: payload
  })),
  error: {},
  setError: action((state, payload) => ({
    error: payload
  }))
};


export default volunteersModel