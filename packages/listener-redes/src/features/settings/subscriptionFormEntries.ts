import gql from 'graphql-tag'
import { client as GraphQLAPI } from '../../graphql'
import { updateFormEntries, insertRedeIndividuals } from './'


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
interface Widget {
	id: number
	group_id: number
	metadata: object
}

interface MetaField {
	uid: string
	name: string
}

const handleNext = (widgets: Widget[]) => async (response: any) => {
	const { data: { form_entries: entries } } = response
	const syncronizedForms = []
	const individuals = []

	entries.forEach((formEntry: any) => {
		const fields = JSON.parse(formEntry.fields)
		const widget = widgets.filter((w: any) => w.id === formEntry.widget_id)[0]
		if (widget) {
			const instance = {}
			widget.metadata['form_mapping'].forEach((field: MetaField) => {
				instance[field.name] = (fields.filter((f: any) => f.uid === field.uid)[0] || {}).value
			})

			// fields of integration
			instance['rede_group_id'] = widget.group_id
			instance['form_entry_id'] = formEntry.id

			// store instances
			individuals.push(instance)
			syncronizedForms.push(formEntry.id)
		}
	})

	// Batch insert individuals
	await insertRedeIndividuals(individuals)
	// Batch update syncronized forms
	await updateFormEntries(syncronizedForms)
}

const error = (err: any) => {
	console.error('Receiving error on subscription GraphQL API: ', err)
}

export default async (widgets: Widget[]): Promise<any> => {
	try {
		const observable = GraphQLAPI
			.subscribe({
				query: FORM_ENTRIES_SUBSCRIPTION,
				variables: { widgets: widgets.map((w: any) => w.id) },
				fetchPolicy: 'network-only'
			})
			.subscribe({ next: handleNext(widgets), error })

		return observable
	} catch (err) {
		console.error('failed on subscription: '.red, err)
		return undefined
	}
}