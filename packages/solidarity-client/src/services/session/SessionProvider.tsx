import React from 'react'
import { FullPageLoading } from 'bonde-styleguide'
import { ApolloProvider } from '@apollo/react-hooks'
import FetchUser from './FetchUser'
import FetchCommunities from './FetchCommunities'
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
  community?: object;
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
      .getAsyncSession()
      .then(({ token, community }: any = {}) => {
        if (!token) throw Error('unauthorized')

        this.setState({ signing: false, authenticated: true, token, community })
        return Promise.resolve()
      })
      .catch((err) => {
        // TODO: change url admin-canary
        if (err && err.message === 'unauthorized') {
          redirectToLogin()
          this.setState({ signing: false, authenticated: false, community: undefined })
        } else {
          // reload fetchSession when error not authorized
          console.log('err', err.message)
          if (this.state.refetchCount < 3) {
            this.fetchSession()
          }
        }
      })
  }

  logout () {
    this.storage
      .logout()
      .then(() => {
        redirectToLogin()
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  handleChangeCommunity (community: any) {
    return this.storage
      .setAsyncItem('community', community)
  }

  render () {
    const sessionProps = {
      authenticated: this.state.authenticated,
      signing: this.state.signing,
      token: this.state.token,
      logout: this.logout.bind(this)
    }

    return !this.state.signing
      ? (
        <ApolloProvider client={createGraphQLClient(sessionProps)}>
          {/* Impplements provider with token recovered on cross-storage */}
          <FetchUser>
            {/* Check token validate and recovery user infos */}
            {(userData: any) => (
              <FetchCommunities
                variables={{ userId: userData.user.id }}
                defaultCommunity={this.state.community}
                onChange={this.handleChangeCommunity.bind(this)}
              >
              {(communitiesData: any) => (
                <SessionContext.Provider value={{...sessionProps, ...userData, ...communitiesData}}>
                  {this.props.children}
                </SessionContext.Provider>
              )}
              </FetchCommunities>
            )}
          </FetchUser>
        </ApolloProvider>
      ) : <FullPageLoading message="Carregando sessão..." />
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
