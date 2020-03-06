import { gql } from 'apollo-boost'

export default gql`
mutation updateIndividual(
  $updateFields: rede_individuals_set_input!
){
  insert_rede_relationships(_set:
    {
      $updateFields
    }
  ) {
    returning {
      id
      name
    }
  }
}
`