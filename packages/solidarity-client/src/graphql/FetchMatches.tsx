import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { SessionHOC } from '../services/session'

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
    recipient {
      id
      name
    }
    volunteer {
      id
      name
    }
    agent {
      id
      first_name
    }
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
  return children(data)
}, { required: true })

export default FetchMatches
