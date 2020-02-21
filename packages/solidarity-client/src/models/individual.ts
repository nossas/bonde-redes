import { action } from 'easy-peasy'

interface Individual {
  email: string
  name: string
  phone: string
}

const data: Individual =  ({
  email: '',
  name: '',
  phone: ''
})

const individualModel = {
  data,
  setIndividual: action((state, payload) => ({
    data: payload
  }))
};

export default individualModel
