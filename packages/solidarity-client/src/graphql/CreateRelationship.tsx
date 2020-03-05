import { gql } from 'apollo-boost'

export default gql`
mutation createRelationship(
  $recipientId: Int!
  $volunteerId: Int!
  $agent: Int!
){
  insert_rede_relationships(objects:
    {
      recipient_id: $recipientId
      volunteer_id: $volunteerId
      status: "pending"
      user_id: $agent
    }
  ) {
    returning {
      comments
      created_at
      id
      is_archived
      metadata
      priority
      recipient {
        id
        first_name
      }
      recipient_id
      status
      updated_at
      volunteer {
        id
        first_name
      }
      agent {
        id
        first_name
      }
      volunteer_id
    }
  }
}
`
