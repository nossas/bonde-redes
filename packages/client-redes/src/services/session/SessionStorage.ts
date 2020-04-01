/* eslint-disable @typescript-eslint/no-explicit-any */
import { CrossStorageClient } from "cross-storage";
import { Community } from "./FetchCommunities";

const SessionStorage = (): {
  logout: () => Promise<any>;
  getAsyncSession: () => Promise<any>;
  setAsyncItem: (arg0: string, arg1: Community) => void;
} => {
  // token?: any;
  // session: any = {};
  // storage: any;
  // authenticated = false;

  // Init session client on cross-storage
  const crossStorageUrl =
    process.env.REACT_APP_DOMAIN_CROSS_STORAGE ||
    "http://cross-storage.bonde.devel";

  const storage = new CrossStorageClient(crossStorageUrl, {
    timeout: process.env.REACT_APP_CROSS_STORAGE_TIMEOUT || "10000"
  });

  const logout = (): Promise<any> =>
    storage
      .onConnect()
      .then(() =>
        storage.del("auth", "community").then(() => Promise.resolve())
      );

  const getAsyncSession = (): Promise<any> =>
    storage
      .onConnect()
      .then(() => storage.get("auth", "community"))
      .then(args => {
        const authJson = args[0];
        const communityJson = args[1];
        if (authJson) {
          const dataSession = {
            token: JSON.parse(authJson).jwtToken || JSON.parse(authJson).token,
            community: communityJson ? JSON.parse(communityJson) : {}
          };
          return Promise.resolve(dataSession);
        }
        return false;
      });

  const setAsyncItem = (key: string, value: Community): Promise<any> =>
    storage.onConnect().then(() => storage.set(key, JSON.stringify(value)));

  return {
    logout,
    getAsyncSession,
    setAsyncItem
  };
};

export default SessionStorage;
