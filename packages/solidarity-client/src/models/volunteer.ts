import { action } from 'easy-peasy';

interface Volunteer {
  latitude: string
  longitude: string
  email: string
  organization_id: number
  name: string
  whatsapp: number
  user_id: number
  phone: string
  registration_number: string
}

const data: Volunteer = {
  latitude: '0',
  longitude: '0',
  email: '',
  organization_id: 0,
  name: '',
  whatsapp: 0,
  user_id: 0,
  phone: '',
  registration_number: ''
}

const volunteerModel = {
  data,
  setVolunteer: action((state, payload) => ({
    data: { ...payload }
  }))
};

export default volunteerModel