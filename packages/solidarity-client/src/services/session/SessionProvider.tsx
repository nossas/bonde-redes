import React from 'react'
import { FullPageLoading } from 'bonde-styleguide'
import SessionStorage from './SessionStorage'

/*
 * Responsible to control session used on cross-storage
 **/

interface SessionProviderState {
  signing: boolean;
  authenticated: boolean;
  token?: string;
}


const SessionContext = React.createContext({ signing: true, authenticated: false });


class SessionProvider extends React.Component {

  storage: SessionStorage;
  state: SessionProviderState;

  constructor (props: any) {
    super(props)
    this.state = { signing: true, authenticated: false }
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
          const loginUrl = process.env.REACT_APP_LOGIN_URL || 'http://admin-canary.bonde.devel:5002/auth/login'
          window.location.href = `${loginUrl}?next=${window.location.href}`
          this.setState({ signing: false, authenticated: false })
        } else {
          // reload fetchSession when error not authorized
          console.log('err', err.message)
          this.fetchSession()
        }
      })
  }

  render () {
    return !this.state.signing
      ? (<SessionContext.Provider value={this.state}>{this.props.children}</SessionContext.Provider>)
      : <FullPageLoading message='Carregando dados de usuário' />
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
