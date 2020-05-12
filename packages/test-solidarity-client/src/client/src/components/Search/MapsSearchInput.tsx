import React from "react";
import { Flexbox2 as Flexbox, Text } from "bonde-styleguide";
import SuggestInput from "./SuggestInput";
import styled from "styled-components";

const SearchAddress = styled.div`
  flex-direction: column;
  display: flex;
`;

type Props = {
  onChangeLocation: Function;
  value: {
    lat: number;
    lng: number;
  };
  name: string;
  label: string;
  placeholder: string;
};

const MapsSearchInput = ({ value, onChangeLocation, ...extraProps }: Props) => {
  return (
    <SearchAddress>
      <SuggestInput
        {...extraProps}
        onSelect={(suggestion: any) => onChangeLocation(suggestion.location)}
      />
      {value && (
        <Flexbox spacing="between">
          <Text fontSize={13}>
            <b>Lat:</b> {value.lat}
          </Text>
          <Text fontSize={13}>
            <b>Lng:</b> {value.lng}
          </Text>
        </Flexbox>
      )}
    </SearchAddress>
  );
};

export default MapsSearchInput;
