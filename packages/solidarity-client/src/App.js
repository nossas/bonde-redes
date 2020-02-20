import "mapbox-gl/dist/mapbox-gl.css";

import React from "react";
import { Footer } from "bonde-styleguide";
import { StoreProvider } from "easy-peasy";
import { Redirect, Route } from "react-router";
import { Router } from "react-router-dom";
import styled from "styled-components";

import Header from "./components/Header";
import history from "./history";
import Map from "./pages/Geobonde/Map";
import Geobonde from "./pages/Geobonde/Table";
import Match from "./pages/Match/Table";
import VolunteersAvailable from "./pages/VolunteersAvailable";

import { SessionProvider } from "./services/session";

import store from "./store";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppBody = styled.div`
  min-height: 100vh;
  flex-grow: 1;
`;

// const FixedFooter = styled.div`
//   flex-shrink: 0;
// `

const App = () => (
  <SessionProvider>
    <StoreProvider store={store}>
      <Router history={history}>
        <AppWrapper className="app">
          <Header />
          <AppBody className="app-body">
            <Route exact path="/">
              <Redirect to="/match" />
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
      </Router>
    </StoreProvider>
  </SessionProvider>
);

export default App;
