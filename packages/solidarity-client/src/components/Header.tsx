import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import {
  Header as BondeHeader,
  Title,
  Button,
  Flexbox,
  Flexbox2
} from "bonde-styleguide";

import Form from "./Form";
import { If } from "./If";
import MatchForm from "./MatchForm";

const StyledBondeHeader = styled(BondeHeader)`
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  display: flex;
  padding: 22px 40px;
`;

const FlexDiv = styled(Flexbox2)`
  width: 450px;
`;

const WrapButtons = styled(Flexbox2)`
  width: 100%; 
`

const isMatch = (path: string) => path === "/match";

const Header: React.FC = ({ children }) => {
  const { pathname: path } = useLocation();

  return (
    <Flexbox vertical>
      <StyledBondeHeader>
        <Flexbox alignItems="middle" row horizontal>
          <Title.H2 color="white">
            {isMatch(path) ? "Match" : "Mapa do acolhimento"}
          </Title.H2>
          {/* <Button onClick={() => { toggleContentState() }}>
            Alternar para
              {' '}
              {visualizationState.get()}
            </Button> */}
          <If condition={path === "/match"}>
            <MatchForm />
          </If>
          <If condition={path === "/geobonde"}>
            <Form />
          </If>
          <If condition={path === "/voluntarias" || path === "/geobonde/mapa"}>
            <WrapButtons justify="flex-end" horizontal>
              <FlexDiv spacing="evenly">
                <Link to="/match">
                  <Button>Encaminhamento</Button>
                </Link>
                <Link to="/geobonde">
                  <Button>Geobonde</Button>
                </Link>
                <If condition={path === "/voluntarias"}>
                  <Link to="/geobonde/mapa">
                    <Button>Mapa</Button>
                  </Link>
                </If>
                <If condition={path === "/geobonde/mapa"}>
                  <Link to="/voluntarias">
                    <Button>Voluntarias</Button>
                  </Link>
                </If>
              </FlexDiv>
            </WrapButtons>
          </If>
        </Flexbox>
      </StyledBondeHeader>
    </Flexbox>
  );
};

Header.defaultProps = {
  children: null
};

Header.propTypes = {
  children: PropTypes.node
};

export default Header;
