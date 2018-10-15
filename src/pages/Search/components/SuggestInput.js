import React from 'react'
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

export default class SuggestInput extends React.Component {
  constructor (props) {
    super(props)

    this.client = GoogleMaps.createClient({
      // TODO: Change to enviroment variable
      key: process.env.REACT_APP_GOOGLE_CLIENT_KEY,
      Promise
    })

    this.state = {
      selected: '',
      value: '',
      suggestions: []
    }
  }

  handleSuggestionsFetchRequested ({ value }) {
    this.client
      .geocode({ address: value, components: { country: 'brasil' } })
      .asPromise()
      .then((res) => {
        if (res.json && res.json.results) {
          const suggestions = res.json.results.map(addr => ({
            address: addr.formatted_address,
            location: addr.geometry.location
          }))

          this.setState({ suggestions })
          return Promise.resolve()
        }
      })
  }

  handleSuggestionsClearRequested () {
    this.setState({ suggestions: [] })
  }

  getSuggestionValue (suggestion) {
    return suggestion.address
  }

  renderSuggestion (suggestion, { isHighlighted }) {
    return <Text>{suggestion.address}</Text>
  }

  renderSuggestionsContainer ({ containerProps, children, query }) {
    return (
      <SuggestionsContainer>
        <div {...containerProps}>
          {children}
        </div>
      </SuggestionsContainer>
    )
  }

  handleSuggestionSelected (e, { suggestion }) {
    const { onSelect } = this.props
    onSelect && onSelect(suggestion)
  }

  render () {
    const inputProps = {
      placeholder: this.props.placeholder,
      label: this.props.label, 
      hint: this.props.hint,
      value: this.state.value,
      onChange: (e, { newValue }) => this.setState({ value: newValue })
    }

    return (
      <AutoSuggest
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested.bind(this)}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested.bind(this)}
        onSuggestionSelected={this.handleSuggestionSelected.bind(this)}
        getSuggestionValue={this.getSuggestionValue.bind(this)}
        renderSuggestion={this.renderSuggestion.bind(this)}
        renderSuggestionsContainer={this.renderSuggestionsContainer.bind(this)}
        alwaysRenderSuggestion={true}
        inputProps={inputProps}
        shouldRenderSuggestions={value => value.trim().length > 4}
        renderInputComponent={(props) => (
          <FormField
            {...props}
            inputComponent={Input}
          />
        )}
      />
    )
  }
}
