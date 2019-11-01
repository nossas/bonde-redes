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

export default {
  tableDataRef,
  submittedParamsRef,
}
