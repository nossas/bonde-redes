import { createStateLink } from '@hookstate/core';

interface SubmittedParams {
  lat: number | null
  lng: number | null
  distance: number
  therapist: boolean
  lawyer: boolean
  individual: boolean
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
  organization_id: number
  tipo_de_acholhimento: string
  link_ticket: number
}

const tableDataRef = createStateLink<PointUser[]>([])
const submittedParamsRef = createStateLink<SubmittedParams>({
  lat: null,
  lng: null,
  distance: 20,
  therapist: true,
  lawyer: true,
  individual: true,
})

export default {
  tableDataRef,
  submittedParamsRef,
}
