import { thunk, action } from 'easy-peasy'
import request from '../services/request'

const volunteersModel = {
  getAvailableVolunteers: thunk(async (actions: any, payload) => {
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