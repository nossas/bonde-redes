import { createStateLink } from '@hookstate/core'
import dicioService from 'components/Table/dicioService'

type serviceTypes = keyof typeof dicioService | 'default'
type geolocationType = {
  lat: number
  lng: number
}

const distanceRef = createStateLink(20)
const geolocationRef = createStateLink<geolocationType | undefined>(undefined)
const lawyerCheckboxRef = createStateLink(true)
const therapistCheckboxRef = createStateLink(true)
const individualCheckboxRef = createStateLink(true)

export default {
  distanceRef,
  geolocationRef,
  lawyerCheckboxRef,
  therapistCheckboxRef,
  individualCheckboxRef,
}
