/* eslint-disable @typescript-eslint/no-explicit-any */
import { setContext } from "apollo-link-context";
import { handleErrorMiddleware } from "./GraphQLHandleError";
import { redirectToLogin } from "../../utils";

export default (session: { token?: string; logout: () => Promise<any> }) => {
  const context = setContext((_: any, { headers }):
    | { headers: { authorization: string } }
    | undefined => {
    if (session && session.token)
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${session.token}`
        }
      };
    return undefined;
  });

  const handleError = handleErrorMiddleware(({ networkError }) => {
    if (
      networkError &&
      (networkError.statusCode === 401 || networkError.statusCode === 403)
    ) {
      session.logout().then(redirectToLogin);
    }
  });

  return { context, handleError };
};
