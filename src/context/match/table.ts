import { createStateLink } from '@hookstate/core';

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
  individualRef
}
