import "mapbox-gl/dist/mapbox-gl.css";

import React from "react";
import { Footer } from "bonde-styleguide";
import { StoreProvider } from "easy-peasy";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";

import Header from "./components/Header";
import history from "./history";
import Map from "./pages/Geobonde/Map";
import Geobonde from "./pages/Geobonde/Table";
import Match from "./pages/Match/Table";
import GroupsWrapper from "./pages/Groups"

import { SessionProvider, SessionPageLayout } from "./services/session";

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

const SamplePage = ({ children }) => (
  <AppWrapper className="app">
    <Header />
    <AppBody className="app-body">
      {children}
    </AppBody>
    <Footer />
  </AppWrapper>
)

const App = () => (
  <SessionProvider>
    <StoreProvider store={store}>
      <BrowserRouter history={history}>
        <Route path="/">
          <Redirect to="/groups" from="/" />
          <SamplePage>
            <Switch>
              <SessionPageLayout
                path="/groups"
                component={GroupsWrapper}
              />
              <SessionPageLayout
                path="/geobonde"
                component={Geobonde}
              />
              <SessionPageLayout
                path="/geobonde/mapa"
                component={Map}
              />
              <SessionPageLayout
                path="/match"
                component={Match}
              />
            </Switch>
          </SamplePage>
        </Route>
      </BrowserRouter>
    </StoreProvider>
  </SessionProvider>
);

export default App;
