import "mapbox-gl/dist/mapbox-gl.css";

import { StoreProvider } from "easy-peasy";
import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { Router } from "react-router-dom";

import Header from "./components/Header";
import history from "./history";
import Match from "./pages/Connect";
import GroupsWrapper from "./pages/Groups";
import Relations from "./pages/Relations";

import { BondeSessionProvider, BondeSessionUI } from "bonde-core-tools";
import store from "./store";

const config = {
  loginUrl: process.env.REACT_APP_LOGIN_URL || 'http://admin-canary.bonde.devel:5002/auth/login',
  graphqlApiUrl: process.env.REACT_APP_HASURA_API_URL || 'https://api-graphql.staging.bonde.org/v1/graphql',
  crossStorageUrl: process.env.REACT_APP_DOMAIN_CROSS_STORAGE || 'http://cross-storage.bonde.devel'
};

const App = () => (
  <BondeSessionProvider config={config}>
    <StoreProvider store={store}>
      <Router history={history}>
        <BondeSessionUI.Main indexRoute='/'>
          <Header zIndex={0} />
          <BondeSessionUI.Content>
            <Switch>
              <Route exact path="/">
                <Redirect to="/groups" />
              </Route>
              <Route path="/groups" component={GroupsWrapper} />
              <Route path="/connect" component={Match} />
              <Route path="/relations" component={Relations} />
            </Switch>
          </BondeSessionUI.Content>
        </BondeSessionUI.Main>
      </Router>
    </StoreProvider>
  </BondeSessionProvider>
);

export default App;
