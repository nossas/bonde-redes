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
import Settings from "./pages/Settings";

import { SessionPageLayout, SessionProvider } from "./services/session";
import store from "./store";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppBody = styled.div`
  min-height: 100vh;
  flex-grow: 1;
`;

const InsideApp = () => (
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
        <Route path="/settings" component={Settings} />
      </Switch>
    </AppBody>
  </AppWrapper>
);

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
