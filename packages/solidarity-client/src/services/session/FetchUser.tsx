import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'
import { FullPageLoading } from 'bonde-styleguide'
import { redirectToLogin } from './SessionProvider'

const FETCH_USER = gql`
query CurrentUser {
	currentUser {
		id
		firstName
		lastName
		email
		createdAt
	}
}
`

export default ({ children }) => {
	const { loading, error, data } = useQuery(FETCH_USER);

  if (loading) return <FullPageLoading message='Carregando usuário...' />

  if (error || !data.currentUser) {
		console.log('error', { error, data })
		redirectToLogin()
  }

 	return children({ user: data.currentUser })
}