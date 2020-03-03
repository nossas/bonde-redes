import gql from 'graphql-tag'
import { client as GraphQLAPI } from '../../graphql'
// import updateFormEntries from './updateFormEntries'
// import { SettingsResponse } from './types'
// import getLastSyncDatetime from './getLastSyncDatetime'
// import fetchFormEntries from './fetchFormEntries'

const FORM_ENTRIES_SUBSCRIPTION = gql`
	subscription pipeline_form_entries ($widgets: [Int!]) {
	  form_entries(
	    where: { widget_id: { _in: $widgets }, rede_syncronized: { _eq: false } },
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
	const syncronizedForms = []

	entries.forEach((formEntry: any) => {
		console.log(`TODO: sync form`, formEntry)
		syncronizedForms.push(formEntry.id)
	})

	// Update all syncronized forms
	// await updateFormEntries(syncronizedForms)
}

const error = (err: any) => {
	console.error('Receiving error on subscription GraphQL API: ', err)
}


export default async (widgets: number[]): Promise<any> => {
	try {
		const observable = GraphQLAPI
			.subscribe({
				query: FORM_ENTRIES_SUBSCRIPTION,
				variables: { widgets },
				fetchPolicy: 'network-only'
			})
			.subscribe({ next, error })

		return observable
	} catch (err) {
		console.error('failed on subscription: '.red, err)
		return undefined
	}
}