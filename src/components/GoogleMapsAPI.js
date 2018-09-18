import React from 'react'
import PropTypes from 'prop-types'
import GoogleMaps from '@google/maps'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    minWidth: '500px'
  }
});

class GoogleMapsAPI extends React.Component {

  constructor (props) {
    super(props)
    this.client = GoogleMaps.createClient({
      key: 'AIzaSyBNOVZLAmI3WM4X2bB-PAVBsIE9C81XCek',
      Promise: Promise
    })
    this.state = { address: '' }
  }

  handleSearchAddress (e) {
    e.preventDefault()

    this.client
      .geocode({ address: this.state.address })
      .asPromise()
      .then(response => {
        console.log('successfully', response)
        if (response.json && response.json.results) {
          const address = response.json.results[0]
          this.props.onSuccess({
            address: address.formatted_address,
            location: address.geometry.location
          })
          return Promise.resolve()
        }
        return Promise.reject('error inválid JSON')
      })
      .catch(err => {
        console.log('error', err)
      })
  }

  render () {
    const { classes } = this.props
    return (
    <Grid item>
    <Card>
    <CardContent>
      <form onSubmit={this.handleSearchAddress.bind(this)}>
        <Input
          type='text'
          onChange={e => this.setState({ address: e.target.value })}
          placeholder='Busque por um endereço'
          value={this.state.address}
          className={classes.input}
        />
        <Button variant="contained" color="secondary" className={classes.button}>
          Buscar
        </Button>
      </form>
    </CardContent>
    </Card>
    </Grid>
    )
  }
}

GoogleMapsAPI.propTypes = {
  onSuccess: PropTypes.func
}

export default withStyles(styles)(GoogleMapsAPI)
