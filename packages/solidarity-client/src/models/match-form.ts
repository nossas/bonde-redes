import { action } from 'easy-peasy';
// import dicioAgent from '../pages/Connect/Table/dicioAgent'

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

// type agentTypes = keyof typeof dicioAgent | 'default'
// const agent: agentTypes = 'default'
const assignee_name: string = ''

const matchFormModel = {
  volunteer,
  // agent,
  assignee_name,
  setForm: action((state, payload) => ({
    ...payload
  }))
};

export default matchFormModel
