import { action } from 'easy-peasy'

interface Individual {
  email: string
  name: string
  ticket_id: number
}

const data: Individual =  ({
  email: '',
  name: '',
  ticket_id: 0
})

const individualModel = {
  data,
  setIndividual: action((state, payload) => ({
    data: payload
  }))
};

export default individualModel
