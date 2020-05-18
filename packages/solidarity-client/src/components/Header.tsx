import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Header as BondeHeader } from "bonde-styleguide";
import { Header as Title } from "bonde-components";

import { Tabs, MatchForm, Form } from "../components";

const StyledBondeHeader = styled(BondeHeader)`
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  padding: 22px 40px;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
`;

const Wrap = styled.div`
  display: grid;
  justify-items: end;
`;

const TabsWrapper = styled.div`
  position: relative;
  top: 22px;
`;

const isMatch = (path: string) => path === "/match";

const Header: React.FC = () => {
  const { pathname: path } = useLocation();
  const [selectedTab, setTab] = useState("pessoas");

  const tabs = [
    {
      name: "mapa",
      to: "/geobonde/mapa"
    },
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
  ];

  useEffect(() => {
    const currentTab = tabs.find(i => i["to"] === path) || { name: "geobonde" };
    setTab(currentTab["name"]);
  }, [path, setTab, tabs]);

  return (
    <StyledBondeHeader>
      <Title.h3 style={{ color: "#ffffff" }}>
        {isMatch(path) ? "Match" : "Mapa do acolhimento"}
      </Title.h3>
      <Wrap>
        {/* <WrapButtons>
          {path !== "/geobonde/mapa" && <Link to="/geobonde/mapa">Mapa</Link>}
          {path !== "/voluntarias" && (
            <Link to="/voluntarias">Voluntárias</Link>
          )}
          {path !== "/match" && <Link to="/match">Encaminhamento</Link>}
          {path !== "/geobonde" && <Link to="/geobonde">Geobonde</Link>}
        </WrapButtons> */}
        {path === "/match" && <MatchForm />}
        {path === "/geobonde" && <Form />}
        <TabsWrapper>
          <Tabs tabs={tabs} selectedTab={selectedTab} />
        </TabsWrapper>
      </Wrap>
    </StyledBondeHeader>
  );
};

export default Header;
