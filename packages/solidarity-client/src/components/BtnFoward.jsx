import React from 'react';
import styled from 'styled-components'
import { Button } from 'bonde-styleguide'
import { useStoreState, useStoreActions } from 'easy-peasy';

import { getUserData } from '../services/utils'

const BtnWarning = styled(Button)`
  border-color: ${props => props.disabled ? 'unset' : '#EE0090'}
  color: ${props => props.disabled ? '#fff' : '#EE0090'}
`

const Foward = ({ id }) => {

  const setIndividual = useStoreActions(actions => actions.individual.setIndividual)
  const setPopup = useStoreActions(actions => actions.popups.setPopup)
  const tableData = useStoreState(state => state.table.data)
  const volunteer = useStoreState(state => state.match.volunteer)

  const onClick = () => {
    // TODO: Tratar caso em que a usuária não tem user_id
    const user = getUserData({
      user: id,
      data: tableData,
      filterBy: "user_id"
    })
    setIndividual(user)
    setPopup({
      confirm: true,
      wrapper:  true
    })
  }

  return (
    <BtnWarning
      light
      onClick={onClick}
      disabled={volunteer.email === ''}
    >
      Encaminhar
    </BtnWarning>
  )
}

export default Foward