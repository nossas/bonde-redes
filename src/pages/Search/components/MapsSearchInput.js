import React from 'react'
import PropTypes from 'prop-types'
import {
  Flexbox2 as Flexbox,
  Text,
  Spacing
} from 'bonde-styleguide'
import SuggestInput from './SuggestInput'

class MapsSearchInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = { loading: false }
  }
  
  render () {
    const { loading } = this.state
    const { value, ...extraProps } = this.props

    return (
      <Spacing margin={{ bottom: 15 }}>
        <SuggestInput
          {...extraProps}
          onSelect={(suggestion) => {
            this.props.onChangeLocation(suggestion.location)
          }}
        />
        {!loading && value && (
          <Flexbox spacing="between">
            <Text fontSize={13}>
              <b>Lat:</b>
              {' '}
              {value.lat}
            </Text>
            <Text fontSize={13}>
              <b>Lng:</b>
              {' '}
              {value.lng}
            </Text>
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
