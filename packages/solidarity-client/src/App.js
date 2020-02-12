import React from 'react'
import { Route, Redirect } from 'react-router'
import { Router } from 'react-router-dom'
import styled from 'styled-components'
import { StoreProvider } from 'easy-peasy';

import 'mapbox-gl/dist/mapbox-gl.css'
import { Footer } from 'bonde-styleguide'
import history from './history'
import store from './store'

import Header from './components/Header'
import Geobonde from './pages/Geobonde/Table'
import Map from './pages/Geobonde/Map'
import Match from './pages/Match/Table'
import VolunteersAvailable from './pages/VolunteersAvailable'

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const AppBody = styled.div`
  min-height: 100vh;
  flex-grow: 1;
`

// const FixedFooter = styled.div`
//   flex-shrink: 0;
// `

const App = () => (
  <StoreProvider store={store}>
    <Router history={history}>
      <AppWrapper className="app">
        <Header />
        <AppBody className="app-body">
          <Route exact path="/">
            <Redirect to="/geobonde" />
          </Route>
          <Route path="/geobonde" exact>
            <Geobonde/>
          </Route>
          <Route path="/geobonde/map" exact>
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
)

export default App
