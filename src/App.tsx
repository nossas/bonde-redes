import React from 'react' 
import { Route } from 'react-router'
import { Router } from 'react-router-dom'
import styled from 'styled-components'

import 'mapbox-gl/dist/mapbox-gl.css'
import { Footer } from 'bonde-styleguide'
import history from './history'

import Header from './components/Header'
import Geobonde from './pages/Geobonde/Table'
import Map from './pages/Geobonde/Map'

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
  
const App = () => 
  <Router history={history}>
    <AppWrapper className="app">
      <Header />
      <AppBody className="app-body">
        <Route path="/geobonde" exact component={Geobonde} />
        <Route path="/geobonde/map" exact component={Map} />
        {/* <Route path="/match" component={Projetos} /> */}
      </AppBody>
      <Footer />
    </AppWrapper>
  </Router>

export default App
