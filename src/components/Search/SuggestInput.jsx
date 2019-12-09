import React, { useState } from 'react'
import styled from 'styled-components'
import AutoSuggest from 'react-autosuggest'
import { FormField, Input, Text } from 'bonde-styleguide'
import GoogleMaps from '@google/maps'

const SuggestionsContainer = styled.div`
  position: relative;
  margin-top: -17px;

  & > div {
    position: absolute;
    background-color: white;
    width: 100%;
    -webkit-box-shadow: 0px 2px 5px -1px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 2px 5px -1px rgba(0,0,0,0.75);
    box-shadow: 0px 2px 5px -1px rgba(0,0,0,0.75);
    z-index: 2;
  }

  & li {
    list-style: none;
    padding: 5px 5px 10px;
    background-color: white;
    border-bottom: 1px solid #c7c7c7;
  }

  & .react-autosuggest__suggestion--highlighted {
    background-color: pink;
  }
`


const googleClient = GoogleMaps.createClient({
  // TODO: Change to enviroment variable
  key: process.env.REACT_APP_GOOGLE_CLIENT_KEY,
  Promise
})

const handleSuggestionsFetchRequested = ({ value }, setSuggestions) => {
  googleClient
    .geocode({ address: value, components: { country: 'brasil' } })
    .asPromise()
    .then((res) => {
      if (res.json && res.json.results) {
        const suggestions = res.json.results.map(addr => ({
          address: addr.formatted_address,
          location: addr.geometry.location
        }))
        setSuggestions(suggestions)
        return Promise.resolve()
      }
    })
}

const getSuggestionValue = (suggestion) => suggestion.address

const renderSuggestion = (suggestion, { isHighlighted }) =>
  <Text>{suggestion.address}</Text>

const renderSuggestionsContainer = ({ containerProps, children, query }) => {
  return (
    <SuggestionsContainer>
      <div {...containerProps}>
        {children}
      </div>
    </SuggestionsContainer>
  )
}

const SuggestInput = ({ placeholder, label, hint, onSelect }) => {
  const [selected, setSelected] = useState()
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const handleSuggestionSelected = onSelect => onSelect && onSelect(suggestions)
  const inputProps = {
    placeholder: placeholder,
    label: label,
    hint: hint,
    value: value,
    onChange: (e, { newValue }) => setValue(newValue)
  }
  return (
    <AutoSuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={value => handleSuggestionsFetchRequested(value, setSuggestions)}
      onSuggestionsClearRequested={() => setSuggestions([])}
      onSuggestionSelected={() => handleSuggestionSelected(onSelect)}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      renderSuggestionsContainer={renderSuggestionsContainer}
      alwaysRenderSuggestion
      inputProps={inputProps}
      shouldRenderSuggestions={value => value.trim().length > 6}
      renderInputComponent={props => (
        <FormField
          {...props}
          inputComponent={Input}
          style={{"color": "#ffffff"}}
        />
      )}
    />
  )
}

export default SuggestInput