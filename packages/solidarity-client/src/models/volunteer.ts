import { action, thunk } from 'easy-peasy'
import request from '../services/request'

interface Volunteer {
  latitude: string
  longitude: string
  email: string
  organization_id: number
  name: string
  whatsapp: string
  user_id: number
  phone: string
  registration_number: string,
}

const data: Volunteer = {
  latitude: '0',
  longitude: '0',
  email: '',
  organization_id: 0,
  name: '',
  whatsapp: '',
  user_id: 0,
  phone: '',
  registration_number: '',
}

const volunteersModel = {
  data,
  setVolunteer: action((state, payload) => ({
    data: payload
  })),
  getVolunteer: thunk(async (actions: any, payload) => {
    try {
      const res = await request.get('user', { id: payload })
      actions.setVolunteer(res.data.length > 0 && res.data[0])
    }
    catch (err) {
      console.log(err)
      actions.setError({
        message: err && err.message
      })
    }
  }),
  error: {},
  setError: action((state, payload) => ({
    error: payload
  }))
};


export default volunteersModel
