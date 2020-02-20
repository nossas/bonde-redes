import "mapbox-gl/dist/mapbox-gl.css";

import React from "react";
import { Footer } from "bonde-styleguide";
import { StoreProvider } from "easy-peasy";
import { Redirect, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import styled from "styled-components";

import Header from "./components/Header";
import history from "./history";
import Map from "./pages/Geobonde/Map";
import Geobonde from "./pages/Geobonde/Table";
import Match from "./pages/Match/Table";
import GroupsWrapper from "./pages/Groups"

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


const TestPage = SessionHOC(({ session }) => {
  const { community } = session
  // TODO: get organizations id on communities modules
  // default envirtoment example
  return !! community ? (
    <FetchUsersByGroup contextID={community.id}>
      {(data) => {
        return (<h1>Isso é uma pagina de teste</h1>)
      }}
    </FetchUsersByGroup>
  ) : <div>{`Você deve selecionar uma comunidade`}</div>
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
  <StoreProvider store={store}>
    <BrowserRouter history={history}>
      <SessionProvider>
        <AppWrapper className="app">
          <Header />
          <AppBody className="app-body">
            <Route exact path="/">
              <Redirect to="/groups" />
            </Route>
            <Route path="/groups" component={GroupsWrapper} />
            <Route exact path="/geobonde">
              <Geobonde />
            </Route>
            <Route exact path="/geobonde/mapa">
              <Map />
            </Route>
            <Route exact path="/voluntarias">
              <Match />
            </Route>
          </AppBody>
          <Footer />
        </AppWrapper>
      </SessionProvider>
    </BrowserRouter>
  </StoreProvider>
);

export default App;
