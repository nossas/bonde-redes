import { gql } from 'apollo-boost'

export default gql`
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