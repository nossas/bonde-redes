import { action } from 'easy-peasy'

export interface User {
  latitude: string
  longitude: string
  name: string
  email: string
  data_de_inscricao_no_bonde?: string
  user_id: number
  condition: string
  organization_id: number
  tipo_de_acholhimento: string
  status_acolhimento: string
  status_inscricao: string
  ticket_status: string
  ticket_id: number
}

const data = <User[]>([])

const tableModel = {
  data,
  setTable: action((state, payload) => ({
    data: payload
  }))
};

export default tableModel
