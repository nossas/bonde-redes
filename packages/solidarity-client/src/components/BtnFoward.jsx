import React from 'react';
import styled from 'styled-components'
import { Button } from 'bonde-styleguide'
import { useStoreState } from 'easy-peasy';

import { getUserData } from '../services/utils'

const BtnWarning = styled(Button)`
  border-color: #EE0090;
  color: #EE0090
`

const Foward = ({ id }) => {

  const setIndividual = useStoreState(state => state.individual.setIndividual)
  const setPopup = useStoreState(state => state.popups.setPopup)
  const tableData = useStoreState(state => state.table.data)

  const onClick = () => {
    const user = getUserData({
      user: id,
      data: tableData,
      filterBy: "ticket_id"
    })
    setIndividual({ ...user })
    setPopup({
      confirm: true,
      wrapper:  true
    })
  }

  return (
    <BtnWarning
      light
      onClick={onClick}
    >
      Encaminhar
    </BtnWarning>
  )
}

export default Foward