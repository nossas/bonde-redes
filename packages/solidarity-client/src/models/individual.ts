import { action } from 'easy-peasy'

interface Individual {
  email: string
  name: string
  phone: string
  id: number
}

const data: Individual =  ({
  email: '',
  name: '',
  phone: '',
  id: 0
})

const individualModel = {
  data,
  setIndividual: action((state, payload) => ({
    data: payload
  }))
};

export default individualModel
