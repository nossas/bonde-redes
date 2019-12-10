import { createStateLink } from '@hookstate/core';

interface Individual {
  email: string
  name: string
  ticket_id: number
}

const individualRef = createStateLink<Individual>({
  email: '',
  name: '',
  ticket_id: 0
})

export default {
  individualRef
}
