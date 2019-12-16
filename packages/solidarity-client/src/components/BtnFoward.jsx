import React from 'react';
import styled from 'styled-components'
import { useStateLink } from '@hookstate/core'
import { Button } from 'bonde-styleguide'

import { getUserData } from '../services/utils'
import GlobalContext from '../context'

const BtnWarning = styled(Button)`
  border-color: #EE0090;
  color: #EE0090
`

const Foward = ({ id }) => {
  const {
    table: { tableDataRef },
    matchTable: { individualRef },
    popups: { popupsRef }
  } = GlobalContext

  const individual = useStateLink(individualRef)
  const tableData = useStateLink(tableDataRef)
  const popups = useStateLink(popupsRef)

  const setIndividual = () => {
    const data = tableData.get()
    const user = getUserData({
      user: id,
      data,
      filterBy: "ticket_id"
    })
    individual.set({ ...user })
    popups.set(prevState => ({
      ...prevState,
      confirm: true,
      wrapper:  true
    }))
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