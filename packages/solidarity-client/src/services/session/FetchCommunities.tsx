import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { FullPageLoading } from 'bonde-styleguide'
import { useQuery } from '@apollo/react-hooks'

const FETCH_RELATED_COMMUNITIES = gql`
query RelatedCommunities($userId: Int!) {
  communities (where: { community_users: { user_id: { _eq: $userId } } }) {
    id
    name
    city
    image
    created_at
    updated_at
  }
}
`

export default ({ children, variables, defaultCommunity, onChange }: any) => {
  const [community, setCommunity] = useState(defaultCommunity)
  const { loading, error, data } = useQuery(FETCH_RELATED_COMMUNITIES, { variables });

  if (loading) return <FullPageLoading message='Carregando comunidades...' />;

  if (error || !data.communities) {
    console.log('error', { error, data })
    return children({ communities: [] })
  }

  const fetchCommunitiesProps = {
    communities: data.communities,
    community: Object.keys(community).length > 0 ? community : undefined,
    onChangeCommunity: (c) => {
      return onChange(c).then(() => setCommunity(c))
    }
  }

	return children(fetchCommunitiesProps)
}
