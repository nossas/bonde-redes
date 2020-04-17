import { CrossStorageClient } from "cross-storage";

class SessionStorage {
  token?: any;

  session: any = {};

  storage: any;

  authenticated = false;

  constructor() {
    // Init session client on cross-storage
    const crossStorageUrl =
      process.env.REACT_APP_DOMAIN_CROSS_STORAGE ||
      "http://cross-storage.bonde.devel";

    this.storage = new CrossStorageClient(crossStorageUrl, {
      timeout: process.env.REACT_APP_CROSS_STORAGE_TIMEOUT || "10000"
    });
  }

  logout() {
    return this.storage.onConnect().then(() => {
      return this.storage.del("auth", "community").then(() => {
        this.token = undefined;
        this.session = {};
      });
    });
  }

  getAsyncToken() {
    return this.storage
      .onConnect()
      .then(() => {
        return this.storage.get("auth");
      })
      .then((authJson: string) => {
        if (authJson) {
          this.token = JSON.parse(authJson).token;
          return Promise.resolve(this.token);
        }
      });
  }

  setAsyncItem(key: string, value: any) {
    return this.storage.onConnect().then(() => {
      return this.storage.set(key, JSON.stringify(value));
    });
  }

  getAsyncItem(key: string) {
    return this.storage
      .onConnect()
      .then(() => {
        return this.storage.get(key);
      })
      .then((value: string) => {
        return Promise.resolve(JSON.parse(value));
      });
  }

  setItem(key: string, value: any) {
    this.session[key] = value;
  }

  getItem(key: string, defaultValue: any) {
    return this.session[key] || defaultValue;
  }
}

export default SessionStorage;
