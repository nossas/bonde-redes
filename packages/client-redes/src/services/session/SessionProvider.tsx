/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect } from "react";
import { FullPageLoading } from "bonde-styleguide";
import { ApolloProvider } from "@apollo/react-hooks";
import SessionStorage from "./SessionStorage";
import createGraphQLClient, { SessionProps } from "./graphql-client";
import FetchUser, { User } from "./FetchUser";
import FetchCommunities, { Community } from "./FetchCommunities";
import { redirectToLogin } from "../utils";

/**
 * Responsible to control session used on cross-storage
 **/

type ContextProps = {
  signing: boolean;
  authenticated: boolean;
  community?: Community;
  Provider;
  Consumer;
  value: {
    sessionProps: SessionProps;
    user: User;
    communities: Community[];
  };
};

const SessionContext = createContext<Partial<ContextProps>>({
  signing: true,
  authenticated: false
});

export default function SessionProvider({ children }) {
  const [defaultCommunity, setDefaultCommunity] = useState<
    Partial<Community | undefined>
  >(undefined);
  const [token, setToken] = useState<Partial<string | undefined>>(undefined);
  const [session, setSession] = useState({
    signing: true,
    authenticated: false,
    refetchCount: 0
  });

  const storage = SessionStorage();

  const fetchSession = (): void => {
    storage
      .getAsyncSession()
      .then(({ token, community }: { token: string; community: Community }) => {
        if (!token) throw Error("unauthorized");

        setSession({ ...session, signing: false, authenticated: true });
        setToken(token);
        setDefaultCommunity(community);
        return Promise.resolve();
      })
      .catch(err => {
        // TODO: change url admin-canary
        if (err && err.message === "unauthorized") {
          redirectToLogin();
          setSession({ ...session, signing: false });
        } else {
          // reload fetchSession when error not authorized
          console.log("err", err.message);
          setSession({ ...session, refetchCount: session.refetchCount++ });
          if (session.refetchCount < 3) fetchSession();
        }
      });
  };

  useEffect(() => {
    if (!token) return fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logout = () =>
    storage
      .logout()
      .then(() => redirectToLogin())
      .catch(err => console.log("err", err)); // TODO: Tratar erros

  const setCommunityOnStorage = (community: Community) =>
    storage.setAsyncItem("community", community);

  const sessionProps: SessionProps = {
    authenticated: session.authenticated,
    signing: session.signing,
    defaultCommunity,
    token,
    logout
  };

  return session.signing ? (
    <FullPageLoading message="Carregando sessão..." />
  ) : (
    <ApolloProvider client={createGraphQLClient(sessionProps)}>
      {/* Impplements provider with token recovered on cross-storage */}
      <FetchUser>
        {/* Check token validate and recovery user infos */}
        {(user: { user: User }) => (
          <FetchCommunities
            variables={{ userId: user.user.id }}
            defaultCommunity={defaultCommunity}
            onChange={setCommunityOnStorage}
          >
            {(communities: Community[]) => (
              <SessionContext.Provider
                value={{ ...sessionProps, ...user, ...communities }}
              >
                {children}
              </SessionContext.Provider>
            )}
          </FetchCommunities>
        )}
      </FetchUser>
    </ApolloProvider>
  );
}

export const SessionHOC = (
  WrappedComponent: any,
  opts?: { required: boolean }
) =>
  class extends React.Component {
    static contextType = SessionContext;

    render() {
      return opts &&
        opts.required &&
        Object.keys(this.context.community).length <= 0 ? (
        <div>Você deve selecionar uma comunidade</div>
      ) : (
        <WrappedComponent {...this.props} session={this.context} />
      );
    }
  };
