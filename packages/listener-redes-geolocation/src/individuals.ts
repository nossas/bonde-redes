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

interface IndividualCoordinates {
  latitude: String
  longitude: String
}

export interface Individual {
  id: Number
  zipcode?: String
  address?: String
  state?: String
  city?: String
  coordinates?: IndividualCoordinates
  created_at?: String
}


interface SubscribeIndividualsResponse {
  data: {
    rede_individuals: Individual[]
  }
}

export const geolocation = async (response: SubscribeIndividualsResponse) => {
  const { data: { rede_individuals: individuals } } = response

	individuals.forEach(async (individual: Individual) => {
    const individualWithGeolocation = await convertCepToAddressWithGoogleApi(individual)

    return mutationUpdateCoordinates(individualWithGeolocation)
	})

  return individuals
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

export const mutationUpdateCoordinates = async (individual: Individual | boolean | { error: GMAPS_ERRORS }): Promise<Record<string, string>> => {
  const { data: { update_rede_individuals: { returning: updatedIndividual } } } = await GraphQLAPI.mutate({
		mutation: REDE_INDIVIDUAL_GEOLOCATION_MUTATION,
    variables: individual
	})

	return updatedIndividual
}
