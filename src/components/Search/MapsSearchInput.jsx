import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Flexbox2 as Flexbox,
  Text,
} from 'bonde-styleguide'
import SuggestInput from './SuggestInput'

const MapsSearchInput = ({ value, onChangeLocation, ...extraProps }) => {

  const [loading, setLoading] = useState(false)

  return (
    <Fragment>
      <SuggestInput
        {...extraProps}
        onSelect={(suggestion) => onChangeLocation(suggestion.location)}
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
    </Fragment>
  )
}

MapsSearchInput.propTypes = {
  onChangeLocation: PropTypes.func,
  value: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  })
}

export default MapsSearchInput
