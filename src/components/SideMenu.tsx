import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Spacing, Title, Text } from 'bonde-styleguide'
import { useStateLink } from '@hookstate/core'
import SearchIcon from 'assets/search.svg'
import AngleLeftIcon from 'assets/angle-left.svg'
import { animated, useSpring } from 'react-spring'
import request from 'util/request'
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

const SideMenu: React.FC = () => {
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

  const [sideMenuOpen, setSideMenuOpen] = useState(true)
  const [searchIconPanelOpen, setSearchIconPanelOpen] = useState(false)
  const distance = useStateLink(distanceRef)
  const geolocation = useStateLink(geolocationRef)
  const individualCheckbox = useStateLink(individualCheckboxRef)
  const lawyerCheckbox = useStateLink(lawyerCheckboxRef)
  const therapistCheckbox = useStateLink(therapistCheckboxRef)
  const tableData = useStateLink(tableDataRef)
  const submittedParams = useStateLink(submittedParamsRef)

  useEffect(() => {
    (async () => {
      const response = await request.get()
      tableData.set(response.data)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const style = useSpring({
    transform: `translateX(${searchIconPanelOpen ? 100 : 0}%)`,
  })

  const submit = async () => {
    submittedParams.set({
      ...geolocation.value!,
      distance: distance.value,
      individual: individualCheckbox.value,
      lawyer: lawyerCheckbox.value,
      therapist: therapistCheckbox.value,
    })
  }

  return (
    <StyledPanel open={sideMenuOpen} direction="left" size={350}>
      <AnimatedImage
        style={style}
        onClick={() => {
          setSideMenuOpen((p) => !p)
          setSearchIconPanelOpen((p) => !p)
        }}
        src={sideMenuOpen ? AngleLeftIcon : SearchIcon}
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
        setSideMenuOpen((p) => !p)
        setSearchIconPanelOpen((p) => !p)
        submit()
      }}
      />
    </StyledPanel>
  )
}

export default SideMenu
