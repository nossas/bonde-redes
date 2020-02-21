import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { SessionHOC } from '../services/session'

const USERS_CONNECTED = gql`
query UsersConnected (
	$context: Int_comparison_exp!
) {
  relations: rede_relations(where: { community_id: $context }) {
    relation_id
    volunteer_name
    individual_name
    created_at
    relation
    status
    updated_at
    agent
  }
}
`

const FetchRelations = SessionHOC((props: any) => {
	const { 
    session: { community },
    children,
	} = props

	if (!community) return <div>Selecione uma comunidade!</div>
	
	const { loading, error, data } = useQuery(USERS_CONNECTED)

	if (loading) return <p>Loading...</p>
	if (error) {
		console.log('error', error)
		return <p>Error</p>
	}
	return children({
		relations: data.relations
	})
})

export default FetchRelations