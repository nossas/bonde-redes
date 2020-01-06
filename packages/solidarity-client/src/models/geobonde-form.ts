import { action } from 'easy-peasy'

interface FormParams {
  lat: number | null
  lng: number | null
  distance: number
  therapist: boolean
  lawyer: boolean
  individual: boolean
}

const form = <FormParams>({
  lat: null,
  lng: null,
  distance: 20,
  therapist: true,
  lawyer: true,
  individual: true,
})

const geobondeForm = {
  form,
  setTable: action((state, payload) => ({
    data: payload
  }))
};


export default geobondeForm