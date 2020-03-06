import gql from 'graphql-tag'
import { client as GraphQLAPI } from './graphql'
import { geolocation } from './geolocation'
import { logger } from './logger'

const REDES_INDIVIDUALS_SUBSCRIPTION = gql`
	subscription pipeline_redes_individuals ($widgets: [Int!]) {
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

const error = (err: Error): void => {
	logger.error('Receiving error on subscription GraphQL API: ', err)
}

export const subscriptionRedesIndividuals = async (): Promise<ZenObservable.Subscription> => {
  try {
    const observable = GraphQLAPI
      .subscribe({
        query: REDES_INDIVIDUALS_SUBSCRIPTION,
        // variables: { },
        fetchPolicy: 'network-only'
      })
      .subscribe({ next: geolocation(), error })

    return observable
  } catch (err) {
    logger.error('failed on subscription: ', err)
    return undefined
  }
}

const FORM_ENTRIES_MUTATION = gql`
mutation update_form_entries ($forms: [Int!]) {
  update_form_entries(_set: { rede_syncronized: true }, where: { id: { _in: $forms } }) {
    returning {
      id
      updated_at
    }
  }
}
`

export const mutationUpdateCoordinates = async (forms: number[]): Promise<Record<string, string>> => {
	const { data: { update_form_entries: { returning: formEntries } } } = await GraphQLAPI.mutate({
		mutation: FORM_ENTRIES_MUTATION,
    variables: { forms }
	})

	return formEntries
}
