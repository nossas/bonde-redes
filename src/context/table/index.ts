import { createStateLink } from '@hookstate/core';
import dicioService from 'components/Table/dicioService';

interface SubmittedParams {
  lat: number
  lng: number
  serviceType: keyof typeof dicioService
  distance: number
}

const tableDataRef = createStateLink([])
const submittedParamsRef = createStateLink<SubmittedParams>({
  lat: 0,
  lng: 0,
  serviceType: 'default',
  distance: 0,
})

const stateViewRef = createStateLink({
  viewport: {
    latitude: -13.7056555,
    longitude: -69.6490712,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  },
})

export default {
  stateViewRef,
  tableDataRef,
  submittedParamsRef,
}
