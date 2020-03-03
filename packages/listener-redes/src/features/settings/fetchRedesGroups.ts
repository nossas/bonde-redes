import gql from 'graphql-tag'
import { client as GraphQLAPI } from '../../graphql'

const FETCH_REDES_QUERY = gql`
query redes {
  rede_groups {
  	id
    name
    is_volunteer
    metadata
    widget_id
    community_id
    created_at
    updated_at
  }
}
`

const fetchRedesGroups = async (): Promise<any> => {
	const { data: { rede_groups: groups } } = await GraphQLAPI.query({
		query: FETCH_REDES_QUERY,
		fetchPolicy: 'network-only'
	})

	return groups
}

export default fetchRedesGroups