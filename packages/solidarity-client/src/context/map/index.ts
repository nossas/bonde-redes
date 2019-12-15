import { createStateLink } from '@hookstate/core'
import { PointUser } from 'context/table'

const stateViewRef = createStateLink({
  viewport: {
    latitude: -13.7056555,
    longitude: -69.6490712,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  },
})

type PopupInfoRefType = Omit<PointUser, 'latitude' | 'longitude'> & {
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
  tipo_de_acholhimento: '',
  status_acolhimento: '',
  status_inscricao: '',
  ticket_status: '',
  ticket_id: 0
})

export default {
  stateViewRef,
  popupInfoRef,
}
