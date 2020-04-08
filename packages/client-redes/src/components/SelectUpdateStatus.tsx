import React from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { Text } from "bonde-styleguide";

const Select = styled.select`
  text-transform: capitalize;
  padding: 5px 0 2px 5px;
  width: 100%;
  border-bottom: 1px solid #ee0099;
  &:active,
  &:hover {
    box-shadow: 0 0 4px rgb(204, 204, 204);
  }
  &:hover {
    box-shadow: 0 0 4px rgb(204, 204, 204);
  }
`;

const Option = styled.option`
  text-transform: capitalize;
`;

interface Params {
  name: string;
  row: {
    _original: {
      id: number;
    };
  };
  options: Array<string>;
  selected: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
}

export default function SelectUpdateStatus({
  name,
  row,
  options,
  selected,
  query,
  type
}: Params) {
  const [update] = useMutation(query);

  const handleOnChange = ({ target: { value } }): Promise<unknown> => {
    const variables = {
      [type]: { [name]: value },
      id: row._original.id
    };
    return update({ 
      variables,
      refetchQueries: ["RedeGroups"]  
    });
  };

  return (
    <Text color="#000">
      <Select onChange={handleOnChange} value={selected}>
        {options.map((i: string) => (
          <Option key={`select-options-${i}`} value={i}>
            {i.replace("_", ": ")}
          </Option>
        ))}
      </Select>
    </Text>
  );
}
