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

type Relationship = {
  volunteer: {
    first_name: string
    id: number
  }
  recipient: {
    first_name: string
    id: number
  }
  created_at: string
  status: string
  updated_at: string
  agent: {
    first_name: string
    id: number
  }
  id: number
}

interface RelationshipData {
  rede_relationships: Relationship[];
}

type RelationshipVars = {
  context: {
    _eq: number
  }
}

const FetchMatches = SessionHOC((props: any) => {
  const { children, session: { community } } = props

  const variables = { context: { _eq: community.id } }

  const { loading, error, data } = useQuery<RelationshipData, RelationshipVars>(MATCHES, { variables })

  if (loading) return <p>Loading...</p>
  if (error) {
    console.log('error', error)
    return <p>Error</p>
  }
  return children(data && data.rede_relationships)
}, { required: true })

export default FetchMatches
