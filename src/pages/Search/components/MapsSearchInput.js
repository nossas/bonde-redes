import React from 'react'
import PropTypes from 'prop-types'
import GoogleMaps from '@google/maps'
import {
  FormField,
  Input,
  Flexbox2 as Flexbox,
  Text,
  Spacing
} from 'bonde-styleguide'

class MapsSearchInput extends React.Component {
  
  constructor (props) {
    super(props)
    this.client = GoogleMaps.createClient({
      // TODO: Change to enviroment variable
      key: 'AIzaSyBNOVZLAmI3WM4X2bB-PAVBsIE9C81XCek',
      Promise: Promise
    })

    this.state = { loading: false, geolocation: undefined }
  }

  handleBlur (e) {
    const { onChangeLocation } = this.props

    const value = e.target.value
    this.setState({ loading: true })
    
    this.client
      .geocode({ address: value })
      .asPromise()
      .then((res) => {
        if (res.json && res.json.results) {         
          const addr = res.json.results[0]
          
          this.setState({ loading: false })
          onChangeLocation && onChangeLocation(addr.geometry.location)
          
          return Promise.resolve()
        }
      })
      .catch(err => {
        console.log('ErrorBlur', err)
        
        this.setState({
          loading: false,
          error: 'Algo deu errado!',
          valid: false
        })
        onChangeLocation && onChangeLocation(undefined)
      })
  }

  render () {
    const { loading } = this.state
    const { value, ...extraProps } = this.props
    return (
      <Spacing margin={{ bottom: 15 }}>
        <FormField
          {...extraProps}
          onBlur={this.handleBlur.bind(this)}
          inputComponent={Input}
          hint={loading && 'buscando endereço...'}
        />
        {!loading && value && (
          <Flexbox spacing='between' margin={{ top: -10 }}>
            <Text fontSize={13}><b>Lat:</b> {value.lat}</Text>
            <Text fontSize={13}><b>Lng:</b> {value.lng}</Text>
          </Flexbox>
        )}
      </Spacing>
    )
  }
}

MapsSearchInput.propTypes = {
  onChangeLocation: PropTypes.func,
  value: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  })
}

export default MapsSearchInput
