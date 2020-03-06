import React from 'react'
import styled from 'styled-components'
import { Text } from 'bonde-styleguide'

const Select = styled.select`
  text-transform: capitalize;
  padding: 5px 0 2px 5px;
  width: 100%;
  border-bottom: 1px solid #ee0099;
  &:active, &:hover {
    box-shadow: 0 0 4px rgb(204, 204, 204);
  }
  &:hover {
    box-shadow: 0 0 4px rgb(204, 204, 204)
  }
`
const Option = styled.option`
  text-transform: capitalize;
`

const SelectStatus = ({ options, selected }) => {
  return (
    <Text color="#000">
      <Select onChange={() => alert("bla")} value={selected}>
        {options.map(i => <Option value={i}>{i.replace("_", ": ")}</Option>)}
      </Select>
    </Text>
  )
}

export default SelectStatus