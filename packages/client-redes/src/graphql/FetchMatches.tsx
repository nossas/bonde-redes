import React from 'react'
import { gql } from 'apollo-boost'
import { SessionHOC, useQuery } from 'bonde-core-tools'

const MATCHES = gql`
query RedeRelationships ($context: Int_comparison_exp!) {
  rede_relationships(where: {
    recipient: {
      group: {
        community_id: $context
      }
    }
  }) {
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
}`

const FetchMatches = SessionHOC((props: any) => {
  const { children, session: { community } } = props

  const variables = { context: { _eq: community.id } }

  const { loading, error, data } = useQuery(MATCHES, { variables })

  if (loading) return <p>Loading...</p>
  if (error) {
    console.log('error', error)
    return <p>Error</p>
  }
  return children(data.rede_relationships)
}, { required: true })

export default FetchMatches
