import gql from 'graphql-tag'
import * as yup from 'yup'
import { client as GraphQLAPI } from './graphql'
import convertCepToAddressWithGoogleApi from './geolocation'
import { 
  SubscribeIndividualsResponse,
  SubscribeIndividual,
} from './types/individual'
import { ConvertCepRes } from './types/geolocation'
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
const schema = yup.object({
  id: yup.number(),
  coordinates: yup.object({
    latitude: yup.string(),
    longitude: yup.string()
  }),
  address: yup.string(),
  state: yup.string(),
  city: yup.string(),
});

type IndividualCoordinates = yup.InferType<typeof schema>;

const validateMutationRes = async (schema, updatedIndividual) => {
  try {
    await schema.validate(updatedIndividual)
    logger.log("info", 'successfuly validated schema of updated coordinates mutation');
    return updatedIndividual
  } catch(e) {
    logger.error('failed to validate schema of updated coordinates mutation response ', e.errors)
    return false
  }
}

export const mutationUpdateCoordinates = async (individual: ConvertCepRes): Promise<IndividualCoordinates[] | false> => {

  const { data: { update_rede_individuals: { returning: updatedIndividual } } } = await GraphQLAPI.mutate({
		mutation: REDE_INDIVIDUAL_GEOLOCATION_MUTATION,
    variables: individual
  })

  return validateMutationRes(schema, updatedIndividual["0"])
}

export const geolocation = (response: SubscribeIndividualsResponse) => {
  const { data: { rede_individuals: individuals } } = response

  individuals.map(async (i: SubscribeIndividual) => {
    const individualWithGeolocation: ConvertCepRes = await convertCepToAddressWithGoogleApi(i)
    
    await mutationUpdateCoordinates(individualWithGeolocation)
  })
};

const REDES_INDIVIDUALS_SUBSCRIPTION = gql`
  subscription pipeline_redes_individuals_geolocation {
    rede_individuals(
      order_by: { created_at: desc }
      where: { address: { _is_null: true } }
    ) {
      id
      zipcode
      created_at
    }
  }
`;

export const subscriptionRedesIndividuals = async (): Promise<ZenObservable.Subscription> => {
  try {
    const observable = GraphQLAPI.subscribe({
      query: REDES_INDIVIDUALS_SUBSCRIPTION,
      // variables: { },
      fetchPolicy: "network-only"
    }).subscribe({ next: geolocation, error });

    return observable;
  } catch (err) {
    logger.error("failed on subscription: ", err);
    return undefined;
  }
}
