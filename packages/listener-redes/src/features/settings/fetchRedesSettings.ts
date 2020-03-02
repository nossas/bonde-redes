import gql from 'graphql-tag'
import { client as GraphQLAPI } from '../../graphql'

const FETCH_REDES_QUERY = gql`
query redes {
  rede_settings(where: { kind: { _eq: "widget" } }) {
    settings
    community_id
  }
}
`

interface Rede {
	community_id: number
	widgets: number[]
	/*syncronized?: string*/
}

/*const getconfig = (config: any) => config.kind === 'widgets'
	? Object.values(config.settings)
	: config.settings.last_sync_datetime*/

const fetchRedesSettings = async (): Promise<Rede[]> => {
	const { data: { rede_settings: configs } } = await GraphQLAPI.query({
		query: FETCH_REDES_QUERY,
		fetchPolicy: 'network-only'
	})

	return configs.map((config: any) => ({
		community_id: config.community_id,
		widgets: Object.values(config.settings)
	}))
}

export default fetchRedesSettings