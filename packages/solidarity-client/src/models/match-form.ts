import { action } from 'easy-peasy';
import dicioAgent from '../pages/Match/Table/dicioAgent'

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

const volunteer: Volunteer = {
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

type agentTypes = keyof typeof dicioAgent | 'default'
const agent: agentTypes = 'default'

const matchFormModel = {
  volunteer,
  setVolunteer: action((state, payload) => ({
    volunteer: { ...payload }
  })),
  agent,
  setAgent: action((state, payload) => ({
    agent: payload
  }))
};

export default matchFormModel