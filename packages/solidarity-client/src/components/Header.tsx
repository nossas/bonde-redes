import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { useStoreActions } from 'easy-peasy';
import {
  Header as BondeHeader,
  Title,
  Button,
  Flexbox
} from 'bonde-styleguide'
import request from '../services/request'

import Form from './Form'
import { If } from './If'
import MatchForm from './MatchForm'

const StyledBondeHeader = styled(BondeHeader)`
  width: 100%;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  display: flex;
  padding: 22px 40px;
`

const FlexDiv = styled(Flexbox)`
  width: 300px;
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
    <Flexbox vertical>
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
          <If condition={path === '/match'}>
            <MatchForm />
          </If>
          <If condition={path === '/geobonde'}>
            <Form />
          </If>
          <If condition={path === '/voluntarias'}>
            <FlexDiv horizontal>
              <Link to='/match'>
                <Button>Encaminhamento</Button>
              </Link>
              <Link to='/geobonde'>
                <Button>Geobonde</Button>
              </Link>
            </FlexDiv>
          </If>
        </Flexbox>
      </StyledBondeHeader>
      {/* <GrownDiv>
        {children}
      </GrownDiv> */}
    </Flexbox>
  )
}

Header.defaultProps = {
  children: null,
}

Header.propTypes = {
  children: PropTypes.node,
}

export default Header
