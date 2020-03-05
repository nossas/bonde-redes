import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Header as BondeHeader,
  Title,
  Spacing
} from "bonde-styleguide";
import PageTabs from './PageTabs'

interface HeaderProps {
  zIndex: number
}

const Header: React.FC<HeaderProps> = ({ zIndex }) => {
  const { pathname: path } = useLocation();
  const [selectedTab, setTab] = useState("pessoas")

  const tabs = [
    {
      "name": "pessoas",
      "to": "/groups/volunteers" || "/connect"
    },
    {
      "name": "relações",
      "to": "/relations"
    }
  ]

  useEffect(() => {
    const currentTab = tabs.find(i => i["to"] === path) || { name: "pessoas" }
    setTab(currentTab["name"])
  }, [path, setTab, tabs])

  return (
    <BondeHeader zIndex={zIndex}>
      <Spacing margin={{ bottom: 20 }}>
        <Title.H3 color="#ffffff">Redes</Title.H3>
      </Spacing>
      <PageTabs
        tabs={tabs}
        selectedTab={selectedTab}
      />
    </BondeHeader>
  );
};

export default Header;
