import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

const USERS_BY_GROUP = gql`
query UsersByGroup ($volunteers: bigint_comparison_exp!, $individuals: bigint_comparison_exp!, ) {
  volunteers: solidarity_users(where: { organization_id: $volunteers }) {
    name
  }
  volunteers_count: solidarity_users_aggregate(where: { organization_id: $volunteers }) {
    aggregate {
      count
    }
  }
  
  individuals: solidarity_users(where: { organization_id: $individuals }) {
    name
  }
  individuals_count: solidarity_users_aggregate(where: { organization_id: $individuals }) {
    aggregate {
      count
    }
  }
}
`

const FetchUsersByGroup = ({ children, volunteers, individuals }: any) => {
	const variables = {
		volunteers: { _in: volunteers },
		individuals: { _in: individuals }
	}

	const { loading, error, data } = useQuery(USERS_BY_GROUP, { variables })

	if (loading) return <p>Loading...</p>
	if (error) {
		console.log('error', error)
		return <p>Error</p>
	}

	console.log('data', data)
	return children(data)
}

FetchUsersByGroup.defaultProps = {
	volunteers: ['360269610652', '360282119532'],
	individuals: ['360273031591']
}

export default FetchUsersByGroup