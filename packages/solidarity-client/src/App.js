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

import FetchUsersByGroup from './graphql/FetchUsersByGroup'

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

// const FixedFooter = styled.div`
//   flex-shrink: 0;
// `

const TestPage = SessionHOC(({ session }) => {
  const { community } = session
  // TODO: get organizations id on communities modules
  // default envirtoment example
  return (
    <FetchUsersByGroup contextID={community.id}>
      {(data) => {
        return (<h1>Isso é uma pagina de teste</h1>)
      }}
    </FetchUsersByGroup>
  )
})

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
      <Router history={history}>
        {/*<Route exact path="/">
          <Redirect to="/match" />
        </Route>*/}
        <SessionPageLayout
          path="/"
          exact
          component={TestPage}
        />
        <SessionPageLayout
          path="/geobonde"
          exact
          component={() => (
            <SamplePage>
              <Geobonde />
            </SamplePage>
          )}
        />
        <SessionPageLayout
          exact
          path="/geobonde/mapa"
          component={() => (
            <SamplePage>
              <Map />
            </SamplePage>
          )}
        />
        <SessionPageLayout
          exact
          path="/match"
          component={() => (
            <SamplePage>
              <Match />
            </SamplePage>
          )}
        />
        <SessionPageLayout
          exact
          path="/voluntarias"
          component={() => (
            <SamplePage>
              <VolunteersAvailable />
            </SamplePage>
          )}
        />
      </Router>
    </StoreProvider>
  </SessionProvider>
);

export default App;
