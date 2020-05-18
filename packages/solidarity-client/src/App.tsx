import "mapbox-gl/dist/mapbox-gl.css";

import React from "react";
import { StoreProvider } from "easy-peasy";
import { Redirect, Route } from "react-router";
import { Router } from "react-router-dom";
import { BondeSessionProvider, BondeSessionUI } from "bonde-core-tools";
import { Loading } from "bonde-components";
import styled from "styled-components";

import { Header } from "./components";
import { Geobonde, Match, VolunteersAvailable } from "./pages";
import history from "./history";
import store from "./store";

const AppWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  ${`width: ${window.innerWidth - 16}px;`}
`;

const AppBody = styled.div`
  min-height: 100vh;
  padding: 20px 60px;
`;

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
        <AppWrapper className="app">
          <Header />
          <AppBody className="app-body">
            <Route exact path="/">
              <Redirect to="/voluntarias" />
            </Route>
            <Route exact path="/geobonde">
              <Geobonde />
            </Route>
            {/* <Route exact path="/geobonde/mapa">
                <Map />
              </Route> */}
            <Route exact path="/match">
              <Match />
            </Route>
            <Route exact path="/voluntarias">
              <VolunteersAvailable />
            </Route>
          </AppBody>
        </AppWrapper>
      </Router>
    </StoreProvider>
  </BondeSessionProvider>
);

export default App;
