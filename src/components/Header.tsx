import React from 'react'
import {
  Header as BondeHeader,
  Title,
  Page,
  Footer,
  Button,
  Flexbox2 as Flexbox,
} from 'bonde-styleguide'
import { useStateLink } from '@hookstate/core'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import GlobalContext from '../context'

const StyledBondeHeader = styled(BondeHeader)`
  width: 100%;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  height: 85px;
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

const Header: React.FC = ({ children }) => {
  const {
    visualization: { contentStateRef, toggleContentState },
  } = GlobalContext

  const visualizationState = useStateLink(contentStateRef)

  return (
    <FlexDiv>
      <StyledBondeHeader>
        <Flexbox spacing="between">
          <Title.H3 color="white">Mapa do acolhimento</Title.H3>
          <Button onClick={() => { toggleContentState() }}>
          Alternar para
            {' '}
            {visualizationState.get()}
          </Button>
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
