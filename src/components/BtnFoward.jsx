import React from 'react';
import styled from 'styled-components'
import { Button } from 'bonde-styleguide'
import { useStateLink } from '@hookstate/core'
import { getUserData } from 'services/utils'
import GlobalContext from 'context'

const BtnWarning = styled(Button)`
  border-color: #EE0090;
  color: #EE0090
`

const Foward = ({ id }) => {
  const {
    matchForm: { zendeskAgentRef, volunteerRef },
    table: { tableDataRef },
    matchTable: { individualRef }
  } = GlobalContext

  const volunteer = useStateLink(volunteerRef)
  const zendeskAgent = useStateLink(zendeskAgentRef)
  const individual = useStateLink(individualRef)
  const tableData = useStateLink(tableDataRef)

  const {
    email: volunteerEmail,
    name: volunteerName,
    link_ticket: volunteerTicket
  } = volunteer.value

  const {
    email: individualEmail,
    name: individualName,
    link_ticket: individualTicket
  } = individual.value

  const setIndividual = () => {
    const data = tableData.get()
    const user = getUserData(id, data, "link_ticket")
    individual.set({ ...user })
    console.log({
      msr: { individualEmail, individualName, individualTicket },
      agent: zendeskAgent.value,
      volunteer: { volunteerEmail, volunteerName, volunteerTicket },
    })
  }

  return (
    <BtnWarning
      light
      onClick={setIndividual}
    >
      Encaminhar
    </BtnWarning>
  )
}

export default Foward