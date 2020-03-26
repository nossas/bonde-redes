import { CrossStorageClient } from 'cross-storage'


class SessionStorage {
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

  logout () {
    return this.storage.onConnect()
      .then(() => {
        return this.storage.del('auth', 'community')
          .then(() => {
            this.token = undefined
            this.session = {}
            return Promise.resolve()
          })
      })
  }

  getAsyncSession () {
    return this.storage
      .onConnect()
      .then(() => this.storage.get('auth', 'community'))
      .then((args) => {
        const authJson = args[0]
        const communityJson = args[1]
        if (authJson) {
          const dataSession = {
            token: JSON.parse(authJson).jwtToken || JSON.parse(authJson).token,
            community: communityJson ? JSON.parse(communityJson) : {}
          }
          return Promise.resolve(dataSession)
        }
      })
  }

  setAsyncItem (key: string, value: any) {
    return this.storage.onConnect()
      .then(() => {
        return this.storage.set(key, JSON.stringify(value))
      })
  }
}

export default SessionStorage
