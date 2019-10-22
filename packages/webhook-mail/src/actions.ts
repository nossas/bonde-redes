import gql from 'graphql-tag'
import GraphQLAPI from './GraphQLAPI'

export const delivery = async (mailId: number) => {
  const mutation = gql`
  mutation ConfirmDelivery($mailId: Int!, $deliveredAt: timestamp!) {
    update_notify_mail(
      _set: { delivered_at: $deliveredAt },
    where: { id: { _eq: $mailId } }
    ) {
      returning {
        id
        email_to
        email_from
        context
        subject
        body
        delivered_at
      }
    }
  }
  `
  const variables = { mailId, deliveredAt: new Date().toISOString() }
  return GraphQLAPI.mutate({ mutation, variables })
}