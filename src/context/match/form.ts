import { createStateLink } from '@hookstate/core'
import dicioAgent from 'pages/Match/Table/dicioAgent'

type agentTypes = keyof typeof dicioAgent | 'default'

const volunteerEmailRef = createStateLink('')
const zendeskAgentRef = createStateLink<agentTypes>('default')

interface Volunteer {
  latitude: string
  longitude: string
  email: string
  organization_id: number
  name: string
  link_ticket: number
}

const volunteerRef = createStateLink<Volunteer>({
  latitude: '0',
  longitude: '0',
  email: '',
  organization_id: 0,
  name: '',
  link_ticket: 0
})

export default {
  volunteerEmailRef,
  zendeskAgentRef,
  volunteerRef
}

