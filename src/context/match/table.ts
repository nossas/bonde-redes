import { createStateLink } from '@hookstate/core';

interface SubmittedParams {
  email: string
  agent: string
}

interface Volunteer {
  latitude: string
  longitude: string
  email: string
  tipo_acolhimento: string
}

const volunteerRef = createStateLink<Volunteer>({
  latitude: '0',
  longitude: '0',
  email: '',
  tipo_acolhimento: '',
})

const submittedParamsRef = createStateLink<SubmittedParams>({
  email: "",
  agent: "",
})

export default {
  submittedParamsRef,
  volunteerRef
}
