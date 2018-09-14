import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import GoogleMapsAPI from './components/GoogleMapsAPI'

class App extends Component {

  state = {
    address: undefined,
    location: undefined
  }

  render() {
    const { address, location } = this.state
    return (
      <Grid container>
        <Grid item xs={12}>
          <h1>Bem vindo ao GeoBONDE.</h1>
        </Grid>
        <Grid item xs={12}>
          <GoogleMapsAPI
            onSuccess={(values) => {
              this.setState(values)
            }}
          />
        </Grid>
        {address && location && (
          <Grid>
            <span>{address}</span>
            <ul>
              <li><b>Latitude:</b> {location.lat}</li>
              <li><b>Longitude:</b> {location.lng}</li>
            </ul>
          </Grid>
        )}
      </Grid>
    )
  }
}

export default App
