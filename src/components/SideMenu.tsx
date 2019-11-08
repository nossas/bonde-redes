import React from 'react'
import styled from 'styled-components'
import { Spacing, Title, Text } from 'bonde-styleguide'
import { useStateLink } from '@hookstate/core'
import SearchIcon from 'assets/search.svg'
import AngleLeftIcon from 'assets/angle-left.svg'
import { animated, useSpring } from 'react-spring'
import request from 'util/request'
import PropTypes from 'prop-types'
import GlobalContext from '../context'
import Panel from './Panel'
import Form from './Form'

const StyledPanel = styled(Panel)`
  position: absolute;
  left: 0;
  height: 100%;
  background-color: white;
  width: 350px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  z-index: 1;
  padding: 16px;
`

const StyledImage = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  padding: 10px;
`

const AnimatedImage = animated(StyledImage)

const SideMenu: React.FC = ({ children }) => {
  const {
    sideMenu: {
      isSideMenuOpenRef,
      toggleSideMenu,
      isSearchIconPanelOpenRef,
      toggleSearchIconPanel,
    },
    form: {
      distanceRef,
      geolocationRef,
      serviceTypeRef,
    },
    table: {
      tableDataRef,
      submittedParamsRef,
    },
  } = GlobalContext

  const sideMenuOpen = useStateLink(isSideMenuOpenRef)
  const searchIconPanelOpen = useStateLink(isSearchIconPanelOpenRef)
  const distance = useStateLink(distanceRef)
  const geolocation = useStateLink(geolocationRef)
  const serviceType = useStateLink(serviceTypeRef)
  const tableData = useStateLink(tableDataRef)
  const submittedParams = useStateLink(submittedParamsRef)

  const style = useSpring({
    transform: `translateX(${searchIconPanelOpen.value ? 100 : 0}%)`,
  })

  const submit = async () => {
    const params = {
      ...geolocation.value!,
      distance: distance.value,
      serviceType: serviceType.value,
    }
    const response = await request.get('/api', params)
    tableData.set([])
    submittedParams.set(params)
    tableData.set(response.data)
  }

  return (
    <>
      <StyledPanel open={sideMenuOpen.value} direction="left" size={350}>
        <AnimatedImage
          style={style}
          onClick={() => {
            toggleSideMenu()
            toggleSearchIconPanel()
          }}
          src={sideMenuOpen.value ? AngleLeftIcon : SearchIcon}
          width={50}
          height={50}
        />
        <Spacing margin={{ bottom: 15 }}>
          <Title.H2 align="center">Novo Match</Title.H2>
        </Spacing>
        <Spacing margin={{ bottom: 35 }}>
          <Text align="center">Insira os dados da pessoa e o tipo de atendimento que você deseja buscar:</Text>
        </Spacing>
        <Form onSubmit={async () => {
          toggleSideMenu()
          toggleSearchIconPanel()
          submit()
        }}
        />
      </StyledPanel>
      {children}
    </>
  )
}

SideMenu.defaultProps = {
  children: null,
}

SideMenu.propTypes = {
  children: PropTypes.node,
}

export default SideMenu
