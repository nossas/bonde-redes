import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { SessionHOC } from '../services/session'

const USER_BY_ID = gql`
query UserById (
	$id: bigint_comparison_exp!,
	$context: Int_comparison_exp!
) {
  user: solidarity_users(where: { id: $id, community_id: $context }) {
    user_id
    email
    name
    organization_id
    latitude
    longitude
    data_de_inscricao_no_bonde
    condition
    whatsapp
    phone
  }
}
`

const FetchByUserId = SessionHOC((props: any) => {
	const { 
    session: { community },
    children,
    id
	} = props

	if (!community) return <div>Selecione uma comunidade!</div>
	
	const variables = {
		id: { _eq: id },
		context: { _eq: community.id }
	}

	const { loading, error, data } = useQuery(USER_BY_ID, { variables })

	if (loading) return <p>Loading...</p>
	if (error) {
		console.log('error', error)
		return <p>Error</p>
	}
	return children({
		user: data.volunteer
	})
})

export default FetchByUserId