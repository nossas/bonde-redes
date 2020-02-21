import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { SessionHOC } from '../services/session'

const USERS_BY_GROUP = gql`
query RedeGroups($context: Int_comparison_exp!) {
  volunteers: rede_individuals(where: {
    group: {
      community_id: $context,
      is_volunteer: { _eq: true }
    }
  }) {
    ...individual
  },
  volunteers_count: rede_individuals_aggregate(where: {
    group: {
      community_id: $context,
      is_volunteer: { _eq: true }
    }
  }) {
    aggregate {
      count
    }
  },
  individuals: rede_individuals(where: {
    group: {
      community_id: $context,
      is_volunteer: { _eq: false }
    }
  }) {
    ...individual
  },
  individuals_count: rede_individuals_aggregate(where: {
    group: {
      community_id: $context,
      is_volunteer: { _eq: false }
    }
  }) {
    aggregate {
      count
    }
  },
}

fragment individual on rede_individuals {
	address
	city
	created_at
	email
	field_occupation
	form_entry_id
	id
	latitude
	longitude
	name
	phone
	rede_group_id
	register_occupation
	state
	updated_at
	whatsapp
}
`

const FetchUsersByGroup = SessionHOC((props: any) => {
	const { children, session: { community } } = props

	const variables = { context: { _eq: community.id } }

	const { loading, error, data } = useQuery(USERS_BY_GROUP, { variables })

	if (loading) return <p>Loading...</p>

	if (error) {
		console.log('error', error)
		return <p>Error</p>
	}

	return children({
		volunteers: {
			data: data.volunteers,
			count: data.volunteers_count.aggregate.count
		},
		individuals: {
			data: data.individuals,
			count: data.individuals_count.aggregate.count
		}
	})
}, { required: true })

export default FetchUsersByGroup