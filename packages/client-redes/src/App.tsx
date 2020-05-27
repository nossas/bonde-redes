// import "mapbox-gl/dist/mapbox-gl.css";
import "react-toastify/dist/ReactToastify.css";

import { StoreProvider } from "easy-peasy";
import React from "react";
import styled from "styled-components";
import { Redirect, Route, Switch } from "react-router";
import { Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Loading } from "bonde-components";
import { BondeSessionProvider, BondeSessionUI } from "bonde-core-tools";

import Header from "./components/Header";
import history from "./history";
import Match from "./pages/Connect";
import GroupsWrapper from "./pages/Groups";
import Relations from "./pages/Relations";
import Settings from "./pages/Settings";

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

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  ${`width: ${window.innerWidth - 16}px;`}
`;

const Wrap = styled.div`
  padding: 20px 60px;
`;

const BondeToastify = styled(ToastContainer)`
  & > .Toastify_toast {
    padding: 15px;
  }
  & > .Toastify__toast.Toastify__toast--success {
    background-color: #50e3c2;
  }
  & > .Toastify__toast .Toastify__toast-body {
    font-family: "Nunito Sans", sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: white;
  }
`;

const App = () => {
  const adminUrl =
    process.env.REACT_APP_ADMIN_URL ||
    "http://admin-canary.bonde.devel:5001/admin";
  return (
    <BondeSessionProvider
      fetchData
      environment={process.env.REACT_APP_ENVIRONMENT || ("development" as any)}
      loading={TextLoading}
    >
      <StoreProvider store={store}>
        <SettingsProvider>
          <FilterProvider>
            <Router history={history}>
              <BondeSessionUI indexRoute={adminUrl}>
                <Content>
                  <Header zIndex={0} />
                  <Wrap>
                    <BondeToastify>
                      <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        draggable={false}
                        pauseOnHover
                      />
                    </BondeToastify>
                    <Switch>
                      <Route exact path="/">
                        <Redirect to="/groups" />
                      </Route>
                      <Route path="/groups" component={GroupsWrapper} />
                      <Route path="/connect" component={Match} />
                      <Route path="/relations" component={Relations} />
                      <Route path="/settings" component={Settings} />
                    </Switch>
                  </Wrap>
                </Content>
              </BondeSessionUI>
            </Router>
          </FilterProvider>
        </SettingsProvider>
      </StoreProvider>
    </BondeSessionProvider>
  );
};

export default App;
