import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Header as BondeHeader,
  Title,
  Spacing
} from "bonde-styleguide";
import styled from 'styled-components'
import PageTabs from './PageTabs'

const Header: React.FC = () => {
  const { pathname: path } = useLocation();
  const [selectedTab, setTab] = useState("grupos")

  const tabs = [
    { 
      "name": "grupos", 
      "to": "/groups/volunteers" || "/connect"
    },
    { 
      "name": "relações", 
      "to": "/relations"
    }
  ]

  useEffect(() => {
    const currentTab = tabs.find(i => i["to"] === path) || { name: "grupos" }
    setTab(currentTab["name"])
  }, [path, setTab, tabs])

  const StyledHeader = styled(BondeHeader)`
    z-index: unset;
  `

  return (
    <StyledHeader>
      <Spacing margin={{ bottom: 20 }}>
        <Title.H3 color="#ffffff">Redes</Title.H3>
      </Spacing>
      <PageTabs 
        tabs={tabs} 
        selectedTab={selectedTab} 
      />
    </StyledHeader>
  );
};

export default Header;
