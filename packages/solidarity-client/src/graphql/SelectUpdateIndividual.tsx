import React from 'react'
import styled from 'styled-components'
import { gql } from 'apollo-boost'
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

const UPDATE_INDIVIDUAL_MUTATION = gql`
mutation updateIndividual(
  $id: Int!,
  $individual: rede_individuals_set_input!
){
  update_rede_individuals(
    _set: $individual,
    where: { id: { _eq: $id } }
  ) {
    returning {
      ...individual
    }
  }
}

fragment individual on rede_individuals {
  id
  first_name
  last_name
  email
  whatsapp
  phone
  
  zipcode
  address
  city
  coordinates
  state
  
  status
  availability

  extras
  
  form_entry_id
  group {
    id
    community_id
    is_volunteer
  }
  
  created_at
  updated_at
}
`

export default ({ name, row, options, selected }) => {
  const [updateIndividual] = useMutation(UPDATE_INDIVIDUAL_MUTATION)

  const handleOnChange = ({ target: { value } }) => {
    const variables = {
      id: row._original.id,
      individual: { [name]: value }
    }
    
    updateIndividual({ variables })
  }

  return (
    <Text color="#000">
      <Select onChange={handleOnChange} value={selected}>
        {options
          .map(i => 
            <Option value={i}>{i}</Option>
          )
        }
      </Select>
    </Text>
  )
}