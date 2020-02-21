import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button } from 'bonde-styleguide'
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useHistory } from 'react-router-dom'
import { getUserData } from '../services/utils'

const BtnWarning = styled(Button)`
  border-color: ${props => props.disabled ? 'unset' : '#EE0090'}
  color: ${props => props.disabled ? '#fff' : '#EE0090'}
`

const BtnForward = ({ id }) => {
  const setVolunteer = useStoreActions(actions => actions.volunteer.setVolunteer)
  const tableData = useStoreState(state => state.table.data)
  const history = useHistory()
  const onClick = () => {
    // TODO: Tratar caso em que a usuária não tem user_id
    const user = getUserData({
      user: id,
      data: tableData.volunteers,
      filterBy: "id"
    })
    setVolunteer(user)
    history.push("/connect")
  }

  return (
    <BtnWarning
      light
      onClick={onClick}
    >
      fazer match
    </BtnWarning>
  )
}

BtnForward.propTypes = {
  id: PropTypes.number.isRequired
}

export default BtnForward