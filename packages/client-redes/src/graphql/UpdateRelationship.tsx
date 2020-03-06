import { gql } from 'apollo-boost'

export default gql`
mutation updateRelationship(
  $id: Int!,
  $relationship: rede_relationships_set_input!
){
  update_rede_relationships(
    _set: $relationship,
    where: { id: { _eq: $id } }
  ) {
    returning {
      ...relationship
    }
  }
}

fragment relationship on rede_relationships {
  status
  is_archived
  comments
  metadata
  updated_at
  created_at
  recipient {
    id
    first_name
  }
  volunteer {
    id
    first_name
  }
  agent {
    id
    first_name
  }
  id
}
`
