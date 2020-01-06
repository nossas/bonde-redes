import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { useStoreActions } from 'easy-peasy';

import {
  Header as BondeHeader,
  Title,
  // Button,
  Flexbox
} from 'bonde-styleguide'
import request from '../services/request'

import Form from './Form'
import { IfElse } from './If'
import MatchForm from './MatchForm'

const StyledBondeHeader = styled(BondeHeader)`
  width: 100%;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  display: flex;
  padding: 22px 40px;
`

const FlexDiv = styled.div`
  display: flex;
  flex-direction: column;
`

// const GrownDiv = styled.div`
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   flex-grow: 1;
// `

// const visualizationState = useStateLink(contentStateRef)
const isMatch = (path: string) => path === '/match'

const Header: React.FC = ({ children }) => {
  const { pathname: path } = useLocation()
  const setTableData = useStoreActions((actions: any) => actions.table.setTable)
  
  useEffect(() => {
    (async () => {
      const response = await request.get()
      setTableData(response.data)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FlexDiv>
      <StyledBondeHeader>
        <Flexbox alignItems="middle" fullSize row horizontal>
          <Title.H2 color="white">
            {isMatch(path) ? 'Match' : 'Mapa do acolhimento'}
          </Title.H2>
          {/* <Button onClick={() => { toggleContentState() }}>
            Alternar para
              {' '}
              {visualizationState.get()}
            </Button> */}
          <IfElse
            condition={isMatch(path)}
            True={<MatchForm />}
            False={<Form />}
          />
        </Flexbox>
      </StyledBondeHeader>
      {/* <GrownDiv>
        {children}
      </GrownDiv> */}
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
