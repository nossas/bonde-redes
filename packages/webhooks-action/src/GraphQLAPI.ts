import { ApolloClient } from 'apollo-client'
import { ApolloLink, concat, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

if (!process.env.JWT_TOKEN) throw new Error('Please specify the `JWT_TOKEN` environment variable.')

// Create an http link:
const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_HTTP_URL || 'http://localhost:3000/graphql'
})

// Create auth middleware for http request
const authMiddleware = new ApolloLink((operation, forward) => {
  const headers = {
    Authorization: `Bearer ${process.env.JWT_TOKEN}`
  }

  operation.setContext({ headers })
  return forward(operation)
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: process.env.GRAPHQL_WS_URL || `ws://localhost:5000/`,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        authorization: `Bearer ${process.env.JWT_TOKEN}`
      }
    }
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
)

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, link)
})