import React from 'react'
import styled from 'styled-components'
import { useMutation } from '@apollo/react-hooks'
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

export default ({ name, row, options, selected, query, type }) => {
  const [update] = useMutation(query)

  const handleOnChange = ({ target: { value } }) => {
    const variables = {
      [type]: { [name]: value },
      id: row._original.id
    }
    update({ variables })
  }

  return (
    <Text color="#000">
      <Select onChange={handleOnChange} value={selected}>
        {options
          .map(i => 
            <Option value={i}>{i.replace("_", ": ")}</Option>
          )
        }
      </Select>
    </Text>
  )
}