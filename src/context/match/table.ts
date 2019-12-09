import { createStateLink } from '@hookstate/core';

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

interface Individual {
  email: string
  name: string
  link_ticket: number
}

const individualRef = createStateLink<Individual>({
  email: '',
  name: '',
  link_ticket: 0
})

export default {
  tableDataRef,
  individualRef
}
