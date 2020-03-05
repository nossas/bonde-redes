import { gql } from 'apollo-boost'

export default gql`
mutation createRelationship(
  $recipientId: Int!
  $volunteerId: Int!
  $agent: users_insert_input!
){
  insert_rede_relationships(objects:
    {
      recipient_id: $recipientId
      volunteer_id: $volunteerId
      status: "pending"
      agent: {
        data: $agent
      }
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
        name
      }
      recipient_id
      status
      updated_at
      volunteer {
        id
        name
      }
      volunteer_id
    }
  }
}
`
