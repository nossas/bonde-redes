import { createStateLink } from '@hookstate/core';

interface Volunteer {
  latitude: string
  longitude: string
  email: string
  organization_id: number
}

const volunteerRef = createStateLink<Volunteer>({
  latitude: '0',
  longitude: '0',
  email: '',
  organization_id: 0
})

interface MatchUsers {
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

const tableDataRef = createStateLink<MatchUsers[]>([])

export default {
  volunteerRef,
  tableDataRef
}
