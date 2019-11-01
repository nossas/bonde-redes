import { createStateLink } from '@hookstate/core'
import dicioService from 'components/Table/dicioService'

type serviceTypes = keyof typeof dicioService | 'default'
type geolocationType = {
  lat: number
  lng: number
}

const distanceRef = createStateLink(80)
const serviceTypeRef = createStateLink<serviceTypes>('default')
const geolocationRef = createStateLink<geolocationType | undefined>(undefined)

export default {
  distanceRef,
  serviceTypeRef,
  geolocationRef,
}
