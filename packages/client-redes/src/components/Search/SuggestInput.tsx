import React from "react";
import styled from "styled-components";
import AutoSuggest from "react-autosuggest";
import { FormField, Input, Text } from "bonde-styleguide";
import GoogleMaps from "@google/maps";

const SuggestionsContainer = styled.div`
  position: relative;
  margin-top: -17px;

  & > div {
    position: absolute;
    background-color: white;
    width: 100%;
    -webkit-box-shadow: 0px 2px 5px -1px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 2px 5px -1px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 2px 5px -1px rgba(0, 0, 0, 0.75);
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
`;

export default class SuggestInput extends React.Component<{
  placeholder: string;
  label: string;
  hint: string;
  onSelect: (suggestion: string) => void;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
  state: { value: string; suggestions: string[]; selected: string };
  constructor(props) {
    super(props);
    this.client = GoogleMaps.createClient({
      // TODO: Change to enviroment variable
      key: process.env.REACT_APP_GOOGLE_CLIENT_KEY,
      Promise
    });

    this.state = {
      selected: "",
      value: "",
      suggestions: []
    };
  }

  handleSuggestionsFetchRequested({ value }): void {
    this.client
      .geocode({ address: value, components: { country: "brasil" } })
      .asPromise()
      .then(res => {
        if (res.json && res.json.results) {
          const suggestions = res.json.results.map(addr => ({
            address: addr.formatted_address,
            location: addr.geometry.location
          }));
          this.setState({ suggestions });
          return Promise.resolve();
        }
      })
      .catch(err => console.log(err));
  }

  handleSuggestionsClearRequested(): void {
    this.setState({ suggestions: [] });
  }

  getSuggestionValue(suggestion): string {
    return suggestion.address;
  }

  renderSuggestion(suggestion): React.ReactNode {
    return <Text>{suggestion.address}</Text>;
  }

  renderSuggestionsContainer({
    containerProps,
    children
    // query
  }): React.ReactNode {
    return (
      <SuggestionsContainer>
        <div {...containerProps}>{children}</div>
      </SuggestionsContainer>
    );
  }

  handleSuggestionSelected(e, { suggestion }): void {
    const { onSelect } = this.props;
    onSelect && onSelect(suggestion);
  }

  render(): React.ReactNode {
    const { placeholder, label, hint } = this.props;
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: placeholder,
      label: label,
      hint: hint,
      value: value,
      onChange: (e, { newValue }): void => this.setState({ value: newValue })
    };

    return (
      <AutoSuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested.bind(
          this
        )}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested.bind(
          this
        )}
        onSuggestionSelected={this.handleSuggestionSelected.bind(this)}
        getSuggestionValue={this.getSuggestionValue.bind(this)}
        renderSuggestion={this.renderSuggestion.bind(this)}
        renderSuggestionsContainer={this.renderSuggestionsContainer.bind(this)}
        alwaysRenderSuggestion
        inputProps={inputProps}
        shouldRenderSuggestions={(value): boolean => value.trim().length > 6}
        renderInputComponent={(props): React.ReactNode => (
          <FormField
            {...props}
            inputComponent={Input}
            style={{ color: "#ffffff" }}
          />
        )}
      />
    );
  }
}
