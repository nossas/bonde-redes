import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { SessionHOC } from '../services/session'

const USERS_BY_GROUP = gql`
query UsersByGroup (
	$volunteers: bigint_comparison_exp!,
	$individuals: bigint_comparison_exp!,
	$context: Int_comparison_exp!
) {
  volunteers: solidarity_users(where: { organization_id: $volunteers, community_id: $context }) {
    name
  }
  volunteers_count: solidarity_users_aggregate(where: { organization_id: $volunteers, community_id: $context  }) {
    aggregate {
      count
    }
  }
  
  individuals: solidarity_users(where: { organization_id: $individuals, community_id: $context  }) {
    name
  }
  individuals_count: solidarity_users_aggregate(where: { organization_id: $individuals, community_id: $context  }) {
    aggregate {
      count
    }
  }
}
`

const FetchUsersByGroup = SessionHOC((props: any) => {
	const { 
		children, 
		volunteers = [360269610652, 360282119532], 
		individuals = [360273031591], 
		session: { community } 
	} = props

	if (!community) return <div>Selecione uma comunidade!</div>
	
	const variables = {
		volunteers: { _in: volunteers },
		individuals: { _in: individuals },
		context: { _eq: community.id }
	}

	const { loading, error, data } = useQuery(USERS_BY_GROUP, { variables })

	if (loading) return <p>Loading...</p>
	if (error) {
		console.log('error', error)
		return <p>Error</p>
	}
	return children(data)
})

export default FetchUsersByGroup