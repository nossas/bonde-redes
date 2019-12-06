import { createStateLink } from '@hookstate/core'
import dicioAgent from 'pages/Match/Table/dicioAgent.ts'

const agentsRef = createStateLink(dicioAgent)
const volunteerEmailRef = createStateLink('')

export default {
  volunteerEmailRef,
  agentsRef,
}
