import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header as BondeHeader, Title, Spacing } from "bonde-styleguide";
import Tabs from "./Tabs";
import styled from "styled-components"

type HeaderProps = {
  zIndex: number;
};

const TabsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto 15%;
  position: relative;
  top: 22px;
`

const Header: React.FC<HeaderProps> = ({ zIndex }: HeaderProps) => {
  const { pathname: path } = useLocation();
  const [selectedTab, setTab] = useState("pessoas");

  const tabs = [
    {
      name: "pessoas",
      to: "/groups/volunteers" || "/connect",
      type: "table"
    },
    {
      name: "relações",
      to: "/relations",
      type: "table"
    },
    {
      name: "configurações",
      to: "/settings",
      type: "page"
    }
  ];

  const getTabs = (type) => tabs.filter(t => t.type === type)

  useEffect(() => {
    const currentTab = tabs.find(i => i["to"] === path) || { name: "pessoas" };
    setTab(currentTab["name"]);
  }, [path, setTab, tabs]);

  return (
    <BondeHeader zIndex={zIndex}>
      <Spacing margin={{ bottom: 20 }}>
        <Title.H3 color="#ffffff">Redes</Title.H3>
      </Spacing>
      <TabsWrapper>
        <Tabs tabs={getTabs("table")} selectedTab={selectedTab} />
        <Tabs tabs={getTabs("page")} selectedTab={selectedTab} />
      </TabsWrapper>
    </BondeHeader>
  );
};

export default Header;
