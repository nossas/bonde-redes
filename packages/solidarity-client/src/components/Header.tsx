import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { Header as BondeHeader } from "bonde-styleguide";
import { Header as Title } from "bonde-components";

import Form from "./Form";
import { If } from "./If";
import MatchForm from "./MatchForm";

const StyledBondeHeader = styled(BondeHeader)`
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  padding: 22px 40px;
  align-items: center;
`;

const WrapButtons = styled.div`
  display: grid;
  justify-items: end;
  align-items: center;
  grid-template-columns: auto auto auto;
  grid-column-gap: 20px;

  & a {
    font-family: inherit;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    text-decoration: none;
    color: #fff;

    &:hover,
    &:active {
      text-decoration: underline;
      color: #ee0099;
    }
    &:focus {
      color: #9b9b9b;
    }
  }
`;

const Wrap = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  width: 100%;
  justify-items: end;
  grid-row-gap: 20px;
`;

const isMatch = (path: string) => path === "/match";

const Header: React.FC = ({ children }) => {
  const { pathname: path } = useLocation();

  return (
    <StyledBondeHeader>
      <Title.h2 style={{ color: "#ffffff" }}>
        {isMatch(path) ? "Match" : "Mapa do acolhimento"}
      </Title.h2>
      <Wrap>
        <WrapButtons>
          {path !== "/geobonde/mapa" && <Link to="/geobonde/mapa">Mapa</Link>}
          {path !== "/voluntarias" && (
            <Link to="/voluntarias">Voluntárias</Link>
          )}
          {path !== "/match" && <Link to="/match">Encaminhamento</Link>}
          {path !== "/geobonde" && <Link to="/geobonde">Geobonde</Link>}
        </WrapButtons>
        <If condition={path === "/match"}>
          <MatchForm />
        </If>
        <If condition={path === "/geobonde"}>
          <Form />
        </If>
      </Wrap>
    </StyledBondeHeader>
  );
};

Header.defaultProps = {
  children: null
};

export default Header;
