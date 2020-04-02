import gql from 'graphql-tag'
import * as yup from 'yup'
import { client as GraphQLAPI } from './graphql'
import convertCepToAddressWithGoogleApi from './geolocation'
import { 
  SubscribeIndividualsResponse,
  SubscribeIndividual,
} from './types/individual'
import { IndividualGeolocation } from './types/geolocation'
import { logger } from './logger'

const error = (err: Error): void => {
  logger.error("Receiving error on subscription GraphQL API: ", err);
};

const REDE_INDIVIDUAL_GEOLOCATION_MUTATION = gql`
mutation update_rede_individuals($id: Int!, $address: String!, $state: String!, $city: String!, $coordinates: jsonb!) {
  update_rede_individuals(_set: {coordinates: $coordinates, address: $address, state: $state, city: $city}, where: {id: {_eq: $id}}) {
    returning {
      id
      coordinates
      address
      state
      city
    }
  }
}
`

export const validateMutationRes = async (schema, updatedIndividual) => {
  try {
    const validation = await schema.validate(
      updatedIndividual,
      {strict: true, abortEarly: false}
    )
    logger.log("info", 'successfuly validated schema of updated coordinates mutation');
    return validation
  } catch(e) {
    logger.error('failed to validate schema of updated coordinates', e.errors)
    return false
  }
}

export const mutationUpdateCoordinates = async (individual: IndividualGeolocation): Promise<Record<string, string>> => {
  try {
    const { data: { update_rede_individuals: { returning: updatedIndividual } } } = await GraphQLAPI.mutate({
      mutation: REDE_INDIVIDUAL_GEOLOCATION_MUTATION,
      variables: individual
    })

    logger.log("info", `Updated individual "${individual.id}" coordinates in Hasura`)

    return updatedIndividual
  } catch (err) {
		logger.error(`Failed to update individual "${individual.id}" coordinates in Hasura `, err)
    throw new Error(
      "Failed to update individual coordinates in Hasura"
    );
	}
}

export const schema = yup.object({
  id: yup.number().required(),
  coordinates: yup.object({
    latitude: yup.string().required(),
    longitude: yup.string().required()
  }),
  address: yup.string().required(),
  state: yup.string().required(),
  city: yup.string().required()
});

export const geolocation = (response: SubscribeIndividualsResponse) => {
  const { data: { rede_individuals: individuals } } = response

	individuals.forEach(async (individual: SubscribeIndividual) => {
    const individualWithGeolocation = await convertCepToAddressWithGoogleApi(individual)

    if(!individualWithGeolocation) {
      throw new Error(
        "Google Maps response was invalid."
      );
    }

    const validateDataForMutation = await validateMutationRes(schema, individualWithGeolocation)

    if(!validateDataForMutation) {
      throw new Error(
        "Updated coordinates failed validation"
      );
    }
  
    type UpdateCoordinatesRes = yup.InferType<typeof schema>;
  
    const updatedIndividual: UpdateCoordinatesRes = await mutationUpdateCoordinates(individualWithGeolocation)

    return updatedIndividual
	})

  return individuals
};

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
    logger.error('Failed on subscription: ', err)
    throw new Error(
      "Failed on fetching subscription"
    );  
  }
}
