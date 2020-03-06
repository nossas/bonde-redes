import gql from 'graphql-tag'
import { client as GraphQLAPI } from './graphql'
import { convertCepToAddressWithGoogleApi, GMAPS_ERRORS } from './geolocation'
import { logger } from './logger'

const error = (err: Error): void => {
  logger.error('Receiving error on subscription GraphQL API: ', err)
}

const REDES_INDIVIDUALS_SUBSCRIPTION = gql`
	subscription pipeline_redes_individuals_geolocation {
    rede_individuals(order_by: {created_at: desc}, where: {address: {_is_null: true}}) {
      id,
      zipcode,
      created_at
    }
  }
`

export const subscriptionRedesIndividuals = async (): Promise<ZenObservable.Subscription> => {
  try {
    const observable = GraphQLAPI
      .subscribe({
        query: REDES_INDIVIDUALS_SUBSCRIPTION,
        // variables: { },
        fetchPolicy: 'network-only'
      })
      .subscribe({ next: geolocation, error })

    return observable
  } catch (err) {
    logger.error('failed on subscription: ', err)
    return undefined
  }
}

interface GeoLocationResponse {
  data: {
    rede_individuals: Record<string, string>[]
  }
}

export const geolocation = async (response: GeoLocationResponse) => {
  const { data: { rede_individuals: entries } } = response

	entries.forEach(async (redeIndividuals: Record<string, string>) => {
    const individual = await convertCepToAddressWithGoogleApi(redeIndividuals)

    return mutationUpdateCoordinates(individual)
	})

  return entries
};

const REDE_INDIVIDUAL_GEOLOCATION_MUTATION = gql`
mutation update_rede_individuals($id: Int!, $address: String!, $state: String!, $city: String!, $coordinates: jsonb!) {
  update_rede_individuals(_prepend: {coordinates: $coordinates}, _set: {address: $address, state: $state, city: $city}, where: {id: {_eq: $id}}) {
    returning {
      id
      updated_at
    }
  }
}
`

type IndividualCoordinates = {
  latitude: String;
  longitude: String;
}

export type Individual = {
  id?: Number;
  address: String;
  state: String;
  city: String;
  coordinates: IndividualCoordinates
}

// {
//   "id": 22,
//   "address": "aaaaaaa",
//   "state": "ssssss",
//   "city": "cccccc",
//   "coordinates": {
//     "latitude": "-43,4444",
//     "longitude": "-23,3333"
//   }
// }

export const mutationUpdateCoordinates = async (individual: Individual | boolean | { error: GMAPS_ERRORS }): Promise<Record<string, string>> => {
	const { data: { update_rede_individuals: { returning: updatedIndividual } } } = await GraphQLAPI.mutate({
		mutation: REDE_INDIVIDUAL_GEOLOCATION_MUTATION,
    variables: { individual }
	})

	return updatedIndividual
}
