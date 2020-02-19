import React from 'react'
import { FullPageLoading } from 'bonde-styleguide'
import { ApolloProvider } from '@apollo/react-hooks'
import FetchUser from './FetchUser'
import SessionStorage from './SessionStorage'
import createGraphQLClient from './graphql-client'


export const redirectToLogin = () => {
  const loginUrl = process.env.REACT_APP_LOGIN_URL || 'http://admin-canary.bonde.devel:5002/auth/login'
  window.location.href = `${loginUrl}?next=${window.location.href}`
}

/*
 * Responsible to control session used on cross-storage
 **/

interface SessionProviderState {
  signing: boolean;
  authenticated: boolean;
  token?: string;
  refetchCount: number;
}


const SessionContext = React.createContext({ signing: true, authenticated: false });


class SessionProvider extends React.Component {

  storage: SessionStorage;
  state: SessionProviderState;

  constructor (props: any) {
    super(props)
    this.state = { signing: true, authenticated: false, refetchCount: 0 }
    this.storage = new SessionStorage()
  }

  componentDidMount () {
    this.fetchSession()
  }

  fetchSession () {
    this.storage
      .getAsyncToken()
      .then((token: string) => {
        if (!token) throw Error('unauthorized')

        this.setState({ signing: false, authenticated: true, token })
        return Promise.resolve()
      })
      .catch((err) => {
        // TODO: change url admin-canary
        if (err && err.message === 'unauthorized') {
          redirectToLogin()
          this.setState({ signing: false, authenticated: false })
        } else {
          // reload fetchSession when error not authorized
          console.log('err', err.message)
          if (this.state.refetchCount < 3) {
            this.fetchSession()
          }
        }
      })
  }

  render () {
    const sessionProps = {
      authenticated: this.state.authenticated,
      signing: this.state.signing,
      token: this.state.token,
      logout: this.storage.logout
    }

    return !this.state.signing
      ? (
        <ApolloProvider client={createGraphQLClient(sessionProps)}>
          {/* Impplements provider with token recovered on cross-storage */}
          <FetchUser>
            {/* Check token validate and recovery user infos */}
            {(data: any) => (
              <SessionContext.Provider value={{...sessionProps, ...data}}>
                {this.props.children}
              </SessionContext.Provider>
            )}
          </FetchUser>
        </ApolloProvider>
      ) : <FullPageLoading />
  }
}

export const SessionHOC = (WrappedComponent: any) => class extends React.Component {

  static contextType = SessionContext;

  render () {
    return (
      <WrappedComponent {...this.props} session={this.context} />
    )
  }
}

export default SessionProvider
