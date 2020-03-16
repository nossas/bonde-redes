import "mapbox-gl/dist/mapbox-gl.css";

import { StoreProvider } from "easy-peasy";
import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { Router } from "react-router-dom";
import styled from "styled-components";

import Header from "./components/Header";
import history from "./history";
import Match from "./pages/Connect";
import GroupsWrapper from "./pages/Groups";
import Relations from "./pages/Relations";

import { SessionProvider, SessionPage } from "bonde-core-tools";
import store from "./store";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppBody = styled.div`
  min-height: 100vh;
  flex-grow: 1;
`;

const App = () => (
  <SessionProvider baseLayout={SessionPage}>
    <StoreProvider store={store}>
      <Router history={history}>
        <AppWrapper>
          <Header zIndex={0} />
          <AppBody>
            <Switch>
              <Route exact path="/">
                <Redirect to="/groups" />
              </Route>
              <Route path="/groups" component={GroupsWrapper} />
              <Route path="/connect" component={Match} />
              <Route path="/relations" component={Relations} />
            </Switch>
          </AppBody>
        </AppWrapper>
      </Router>
    </StoreProvider>
  </SessionProvider>
);

export default App;
