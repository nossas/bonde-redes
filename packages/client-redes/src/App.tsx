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
import Settings from "./pages/Settings";

import { Loading } from "bonde-components";
import { BondeSessionProvider, BondeSessionUI } from "bonde-core-tools";
import store from "./store";
import { SettingsProvider } from "./services/SettingsProvider";
import { FilterProvider } from "./services/FilterProvider";

const TextLoading = ({ fetching }: { fetching: string }) => {
  const messages = {
    session: "Carregando sessão...",
    user: "Carregando usuário...",
    communities: "Carregando communities...",
    redirect: "Redirecionando para autenticação..."
  };
  return <Loading fullsize message={messages[fetching]} />;
};

const App = () => {
  const adminUrl =
    process.env.REACT_APP_ADMIN_URL ||
    "http://admin-canary.bonde.devel:5001/admin";
  return (
    <BondeSessionProvider
      fetchData
      environment={process.env.REACT_APP_ENVIRONMENT || "development"}
      loading={TextLoading}
    >
      <StoreProvider store={store}>
        <Router history={history}>
          <SettingsProvider>
            <FilterProvider>
              <BondeSessionUI.Main indexRoute={adminUrl}>
                <Header zIndex={0} />
                <BondeSessionUI.Content>
                  <Switch>
                    <Route exact path="/">
                      <Redirect to="/groups" />
                    </Route>
                    <Route path="/groups" component={GroupsWrapper} />
                    <Route path="/connect" component={Match} />
                    <Route path="/relations" component={Relations} />
                    <Route path="/settings" component={Settings} />
                  </Switch>
                </BondeSessionUI.Content>
              </BondeSessionUI.Main>
            </FilterProvider>
          </SettingsProvider>
        </Router>
      </StoreProvider>
    </BondeSessionProvider>
  );
};

export default App;
