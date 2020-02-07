import { createStateLink } from '@hookstate/core'
import { Ticket } from '../../models/table-data'

const stateViewRef = createStateLink({
  viewport: {
    latitude: -13.7056555,
    longitude: -69.6490712,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  },
})

type PopupInfoRefType = Omit<Ticket, 'latitude' | 'longitude'> & {
  latitude: number
  longitude: number
  open: boolean
}

const popupInfoRef = createStateLink<PopupInfoRefType>({
  latitude: 0,
  longitude: 0,
  open: false,
  name: '',
  data_de_inscricao_no_bonde: '',
  email: '',
  user_id: 0,
  condition: '',
  organization_id: 0,
  tipo_de_acolhimento: '',
  status_acolhimento: '',
  status_inscricao: '',
  ticket_status: '',
  ticket_id: 0,
  ticket_created_at: ''
})

export default {
  stateViewRef,
  popupInfoRef,
}
