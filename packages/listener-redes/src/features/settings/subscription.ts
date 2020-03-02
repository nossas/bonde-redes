import gql from 'graphql-tag'
import { client as GraphQLAPI } from '../../graphql'
// import { SettingsResponse } from './types'
// import getLastSyncDatetime from './getLastSyncDatetime'
// import fetchFormEntries from './fetchFormEntries'

const FORM_ENTRIES_SUBSCRIPTION = gql`
	subscription pipeline_form_entries ($widgets: [Int!], $last: Int!) {
	  form_entries(
	    where: { widget_id: { _in: $widgets }, id: { _gt: $last } },
	    order_by: { id: asc }
	  ) {
      id
      fields
      cached_community_id
      activist_id
      widget_id
      created_at
	  }
	}
`

const next = async (response: any) => {
	const { data: { form_entries: entries } } = response
	entries.forEach((formEntry: any, index: number) => {
		console.log(`formEntry[${index}]`, formEntry)
		/*const lastSyncDatetime = await getLastSyncDatetime(config.community_id)
		Object.values(config.settings).forEach(async (widgetId: number) => {
			const data = await fetchFormEntries({ widgetId, lastSyncDatetime })
			console.log('data', data)
		})*/
	})
}

const error = (err: any) => {
	console.error('Receiving error on subscription GraphQL API: ', err)
}


export default async (widgets: number[]): Promise<any> => {
	try {
		const observable = GraphQLAPI
			.subscribe({
				query: FORM_ENTRIES_SUBSCRIPTION,
				variables: { widgets, last: 0 },
				fetchPolicy: 'network-only'
			})
			.subscribe({ next, error })

		return observable
	} catch (err) {
		console.error('failed on subscription: '.red, err)
		return undefined
	}
}