import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Header as BondeHeader } from "bonde-styleguide";
import { Header as Title } from "bonde-components";

import { Tabs, MatchForm, Form } from ".";

const StyledBondeHeader = styled(BondeHeader)`
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  height: 100px;
  display: grid;
  grid-template-columns: 50% 50%;
`;

const TabsWrapper = styled.div`
  position: absolute;
  margin-top: 30px;
`;

const Header: React.FC = () => {
  const { pathname: path } = useLocation();
  const [selectedTab, setTab] = useState("pessoas");

  const tabs = [
    {
      name: "voluntárias",
      to: "/voluntarias"
    },
    {
      name: "encaminhamento",
      to: "/match"
    },
    {
      name: "geobonde",
      to: "/geobonde"
    }
    // {
    //   name: "mapa",
    //   to: "/geobonde/mapa"
    // }
  ];

  useEffect(() => {
    const currentTab = tabs.find(i => i["to"] === path) || { name: "geobonde" };
    setTab(currentTab["name"]);
  }, [path, setTab, tabs]);

  return (
    <StyledBondeHeader>
      <div>
        <Title.h3 style={{ color: "#ffffff" }}>Match Otimizado</Title.h3>
        <TabsWrapper>
          <Tabs tabs={tabs} selectedTab={selectedTab} />
        </TabsWrapper>
      </div>
      {path === "/match" && <MatchForm />}
      {path === "/geobonde" && <Form />}
    </StyledBondeHeader>
  );
};

export default Header;
