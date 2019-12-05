import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useStateLink } from '@hookstate/core'
import styled from 'styled-components'
import {
  Header as BondeHeader,
  Title,
  // Button,
  Flexbox
} from 'bonde-styleguide'

import request from 'util/request'
import GlobalContext from '../context'

import Form from './Form'

const StyledBondeHeader = styled(BondeHeader)`
  width: 100%;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  display: flex;
  padding: 22px 40px;
`

const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const GrownDiv = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: 1;
`

// const visualizationState = useStateLink(contentStateRef)

const Header: React.FC = ({ children }) => {

  const {
    form: {
      distanceRef,
      geolocationRef,
      individualCheckboxRef,
      lawyerCheckboxRef,
      therapistCheckboxRef,
    },
    table: {
      tableDataRef,
      submittedParamsRef,
    },
  } = GlobalContext
  
  const distance = useStateLink(distanceRef)
  const geolocation = useStateLink(geolocationRef)
  const individualCheckbox = useStateLink(individualCheckboxRef)
  const lawyerCheckbox = useStateLink(lawyerCheckboxRef)
  const therapistCheckbox = useStateLink(therapistCheckboxRef)
  const tableData = useStateLink(tableDataRef)
  const submittedParams = useStateLink(submittedParamsRef)
  
  const submit = async () => {
    submittedParams.set({
      ...geolocation.value!,
      distance: distance.value,
      individual: individualCheckbox.value,
      lawyer: lawyerCheckbox.value,
      therapist: therapistCheckbox.value,
    })
  }

  useEffect(() => {
    (async () => {
      const response = await request.get()
      tableData.set(response.data)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <FlexDiv>
      <StyledBondeHeader>
        <Flexbox alignItems="middle" fullSize row horizontal>
          <Title.H3 color="white">Mapa do acolhimento</Title.H3>
          {/* <Button onClick={() => { toggleContentState() }}>
            Alternar para
              {' '}
              {visualizationState.get()}
            </Button> */}
          <Form onSubmit={async () => submit()} />
        </Flexbox>
      </StyledBondeHeader>
      <GrownDiv>
        {children}
      </GrownDiv>
    </FlexDiv>
  )
}

Header.defaultProps = {
  children: null,
}

Header.propTypes = {
  children: PropTypes.node,
}

export default Header
