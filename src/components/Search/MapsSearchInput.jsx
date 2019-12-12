import React from 'react'
import PropTypes from 'prop-types'
import {
  Flexbox2 as Flexbox,
  Text,
} from 'bonde-styleguide'
import SuggestInput from './SuggestInput'
import styled from 'styled-components'

const SearchAddress = styled.div`
  flex-direction: column;
  display: flex;
`

const MapsSearchInput = ({ value, onChangeLocation, ...extraProps }) => {

  return (
    <SearchAddress>
      <SuggestInput
        {...extraProps}
        onSelect={(suggestion) => onChangeLocation(suggestion.location)}
      />
      {value && (
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
    </SearchAddress>
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
