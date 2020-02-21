import "mapbox-gl/dist/mapbox-gl.css";

import React from "react";
import { StoreProvider } from "easy-peasy";
import { 
  // Redirect, 
  Route, 
  Switch 
} from "react-router";
import { Router } from "react-router-dom";
import styled from "styled-components";

import Header from "./components/Header";
import history from "./history";
import Map from "./pages/Geobonde/Map";
import Geobonde from "./pages/Geobonde/Table";
import Match from "./pages/Connect/Table";
import GroupsWrapper from "./pages/Groups"
// import FetchUsersByGroup from './graphql/FetchUsersByGroup'

import { SessionProvider, SessionPageLayout, SessionHOC } from "./services/session";

import store from "./store";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppBody = styled.div`
  min-height: 100vh;
  flex-grow: 1;
`;

const TestPage = () => (
  <h1>Página de teste</h1>
)

const InsideApp = () => (
  <AppWrapper>
    <Header />
    <AppBody>
      <Switch>
        <Route
          path="/"
          exact
          component={TestPage}
        />
        <Route
          path="/groups"
          component={GroupsWrapper}
        />
        <Route
          path="/geobonde"
          component={Geobonde}
        />
        <Route
          path="geobonde/mapa"
          component={Map}
        />
        <Route
          path="/connect"
          component={Match}
        />
      </Switch>
    </AppBody>
  </AppWrapper>
)

const App = () => (
  <SessionProvider>
    <StoreProvider store={store}>
      <Router history={history}>
        <SessionPageLayout path="/" component={InsideApp} />
      </Router>
    </StoreProvider>
  </SessionProvider>
);

export default App;
