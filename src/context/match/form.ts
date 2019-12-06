import { createStateLink } from '@hookstate/core'
import dicioAgent from 'pages/Match/Table/dicioAgent'

type agentTyppes = keyof typeof dicioAgent | 'default'

const volunteerEmailRef = createStateLink('')
const agentTypeRef = createStateLink<agentTyppes>('default')

export default {
  volunteerEmailRef,
  agentTypeRef,
}

