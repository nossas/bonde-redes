import { action } from 'easy-peasy';

const volunteerModel = {
  data: {
    latitude: '0',
    longitude: '0',
    email: '',
    organization_id: 0,
    name: '',
    whatsapp: 0,
    user_id: 0,
    phone: '',
    registration_number: ''
  },
  setVolunteer: action((state, payload) => ({
    data: { ...payload }
  }))
};

export default volunteerModel