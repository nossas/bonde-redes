import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { redirectToLogin } from './SessionProvider'

const FETCH_USER = gql`
query CurrentUser {
	currentUser {
		firstName
		lastName
		email
		createdAt
	}
}
`

export default ({ children }) => {
	const { loading, error, data } = useQuery(FETCH_USER);

  if (loading) return <p>Loading...</p>;

  if (error || !data.currentUser) {
  	console.log('error', { error, data })
  	redirectToLogin()
  }

 	return children({ user: data.currentUser })
}