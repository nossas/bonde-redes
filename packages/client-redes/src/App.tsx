import "mapbox-gl/dist/mapbox-gl.css";

import { StoreProvider } from "easy-peasy";
import React from "react";
import styled from 'styled-components';
import { Redirect, Route, Switch } from "react-router";
import { Router } from "react-router-dom";

import Header from "./components/Header";
import history from "./history";
import Match from "./pages/Connect";
import GroupsWrapper from "./pages/Groups";
import Relations from "./pages/Relations";

import { Loading } from 'bonde-components';
import { BondeSessionProvider, BondeSessionUI } from "bonde-core-tools";
import { FilterProvider } from './services/FilterContext'
import store from "./store";

const TextLoading = ({ fetching }) => {
  const messages = {
    session: 'Carregando sessão...',
    user: 'Carregando usuário...',
    communities: 'Carregando communities...',
    redirect: 'Redirecionando para autenticação...',
    module: 'Redirecionando para módulo...'
  }
  return <Loading fullsize message={messages[fetching]} />
}

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  ${`width: ${window.innerWidth-16}px;`}

  .wrap {
    padding: 20px 60px;
  }
`

const App = () => {
  const adminUrl = process.env.REACT_APP_ADMIN_URL || 'http://admin-canary.bonde.devel:5001/admin'
  return (
    <BondeSessionProvider
      fetchData
      environment={process.env.REACT_APP_ENVIRONMENT || 'development'}
      loading={TextLoading}
    >
      <StoreProvider store={store}>
        <FilterProvider>
          <Router history={history}>
            <BondeSessionUI indexRoute={adminUrl}>
              <Content>
                <Header zIndex={0} />
                <div className='wrap'>
                  <Switch>
                    <Route exact path="/">
                      <Redirect to="/groups" />
                    </Route>
                    <Route path="/groups" component={GroupsWrapper} />
                    <Route path="/connect" component={Match} />
                    <Route path="/relations" component={Relations} />
                  </Switch>
                </div>
              </Content>
            </BondeSessionUI>
          </Router>
        </FilterProvider>
      </StoreProvider>
    </BondeSessionProvider>
  )
};

export default App;
