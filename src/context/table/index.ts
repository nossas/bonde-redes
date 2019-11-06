import { createStateLink } from '@hookstate/core';
import dicioService from 'components/Table/dicioService';

interface SubmittedParams {
  lat: number
  lng: number
  serviceType: keyof typeof dicioService
  distance: number
}

export interface PointUser {
  latitude: string
  longitude: string
  name: string
  email: string
  data_de_inscricao_no_bonde?: string
  status_inscricao: string
  status_acolhimento: string
  user_id: number
  condition: string
}

const tableDataRef = createStateLink<PointUser[]>([])
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
