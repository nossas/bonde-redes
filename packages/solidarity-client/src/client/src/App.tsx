import "mapbox-gl/dist/mapbox-gl.css";

import React from "react";
import { Footer } from "bonde-styleguide";
import { StoreProvider } from "easy-peasy";
import { Redirect, Route } from "react-router";
import { Router } from "react-router-dom";
import styled from "styled-components";
import { BondeSessionProvider, BondeSessionUI } from "bonde-core-tools";
import { Loading } from "bonde-components";

import Header from "./components/Header";
import history from "./history";
import Map from "./pages/Geobonde/Map";
import Geobonde from "./pages/Geobonde/Table";
import Match from "./pages/Match/Table";
import VolunteersAvailable from "./pages/VolunteersAvailable";

import store from "./store";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppBody = styled.div`
  min-height: 100vh;
  flex-grow: 1;
`;

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  ${`width: ${window.innerWidth - 16}px;`}
`;

// const FixedFooter = styled.div`
//   flex-shrink: 0;
// `

const TextLoading = ({ fetching }: { fetching: string }) => {
  const messages: Record<string, string> = {
    session: "Carregando sessão...",
    user: "Carregando usuário...",
    communities: "Carregando communities...",
    redirect: "Redirecionando para autenticação..."
  };
  return <Loading fullsize message={messages[fetching]} />;
};

const adminUrl =
  process.env.REACT_APP_ADMIN_URL ||
  "http://admin-canary.bonde.devel:5001/admin";

const App = () => (
  <BondeSessionProvider
    fetchData
    environment={(process.env.REACT_APP_ENVIRONMENT || "development") as any}
    loading={TextLoading}
  >
    <StoreProvider store={store}>
      <Router history={history}>
        <BondeSessionUI indexRoute={adminUrl}>
          <Content>
            <AppWrapper className="app">
              <Header />
              <AppBody className="app-body">
                <Route exact path="/">
                  <Redirect to="/voluntarias" />
                </Route>
                <Route exact path="/geobonde">
                  <Geobonde />
                </Route>
                <Route exact path="/geobonde/mapa">
                  <Map />
                </Route>
                <Route exact path="/match">
                  <Match />
                </Route>
                <Route exact path="/voluntarias">
                  <VolunteersAvailable />
                </Route>
              </AppBody>
              <Footer />
            </AppWrapper>
          </Content>
        </BondeSessionUI>
      </Router>
    </StoreProvider>
  </BondeSessionProvider>
);

export default App;
