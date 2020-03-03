import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HandleErrorLink } from './GraphQLHandleError'
import GraphQLSession from './GraphQLSession'


export default (session: any = {}) => {
	const httpLink = createHttpLink({
		uri: process.env.REACT_APP_HASURA_API_URL || 'http://api-graphql.bonde.devel/v1/graphql'
	})
	const { context: authLink, handleError } = GraphQLSession(session)

	return new ApolloClient({
	  link: HandleErrorLink.from([
	    authLink,
	    handleError,
	    httpLink
	  ]),
	  cache: new InMemoryCache()
	})
}