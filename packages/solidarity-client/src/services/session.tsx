import React from 'react'
import { CrossStorageClient } from 'cross-storage'


class AuthAPI {
  token?: any;
  session: any = {};
  storage: any;
  authenticated: boolean = false;

  constructor () {
    // Init session client on cross-storage
    const crossStorageUrl = process.env.REACT_APP_DOMAIN_CROSS_STORAGE || 'http://cross-storage.bonde.devel'

    this.storage = new CrossStorageClient(crossStorageUrl, {
      timeout: process.env.REACT_APP_CROSS_STORAGE_TIMEOUT || '10000'
    })
  }

  login (user: any) {
    return this.storage.onConnect()
      .then(() => {
        this.authenticated = true
        this.token = user.jwtToken
        return this.storage.set('auth', JSON.stringify(user))
      })
  }

  logout () {
    return this.storage.onConnect()
      .then(() => {
        return this.storage.del('auth', 'community')
          .then(() => {
            this.token = undefined
            this.session = {}
          })
      })
  }

  getToken () {
    return this.token
  }

  getAsyncToken () {
    return this.storage.onConnect()
      .then(() => {
        return this.storage.get('auth')
      })
      .then((authJson: string) => {
        if (authJson) {
          this.token = JSON.parse(authJson).jwtToken
          return Promise.resolve(this.token)
        }
      })
  }

  isAuthenticated () {
    return this.token !== undefined
  }

  setAsyncItem (key: string, value: any) {
    return this.storage.onConnect()
      .then(() => {
        return this.storage.set(key, JSON.stringify(value))
      })
  }

  getAsyncItem (key: string) {
    return this.storage.onConnect()
      .then(() => {
        return this.storage.get(key)
      })
      .then((value: string) => {
        return Promise.resolve(JSON.parse(value))
      })
  }

  setItem (key: string, value: any) {
    this.session[key] = value
  }

  getItem (key: string, defaultValue: any) {
    return this.session[key] || defaultValue
  }
}

/*
 * Responsible to control session used on cross-storage
 **/

const Loading = () => (<span>{`authenticating`}</span>)

interface SessionState {
  signing: boolean;
  authenticated: boolean;
}

export class SessionProvider extends React.Component {

  session: AuthAPI;
  state: SessionState;

  constructor (props: any) {
    super(props)
    this.state = { signing: true, authenticated: false }
    this.session = new AuthAPI()
  }

  componentDidMount () {
    this.fetchSession()
  }

  fetchSession () {
    this.session
      .getAsyncToken()
      .then((token: string) => {
        if (!token) throw Error('unauthorized')

        console.log('token', token)
        this.setState({ signing: false, authenticated: true })
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
      ? this.props.children
      : <Loading />
  }
}

export default new AuthAPI()