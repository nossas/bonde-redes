import "colors";
import {
  split,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  ApolloClient,
  concat
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import fetch from "cross-fetch";
import * as ws from "ws";
import { exit } from 'process';

if (!process.env.JWT_TOKEN && !process.env.HASURA_SECRET) {
  throw new Error(
    "Please specify the `JWT_TOKEN` or `HASURA_SECRET` environment variable."
  );
}

const authHeaders = process.env.JWT_TOKEN
  ? { authorization: `Bearer ${process.env.JWT_TOKEN}` }
  : { "x-hasura-admin-secret": process.env.HASURA_SECRET };

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_URL || "data.bonde.devel:3001/graphql",
  fetch
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: authHeaders
  });

  return forward(operation);
});

const subscriptionClient = new SubscriptionClient(
  process.env.WS_GRAPHQL_URL || "ws://localhost:5007/v1/graphql",
  {
    reconnect: true,
    connectionParams: { headers: authHeaders }
  },
  ws
);

subscriptionClient.onConnecting(() => {
  console.log("connecting");
});

subscriptionClient.onConnected(() => {
  console.log("connected");
});

subscriptionClient.onReconnecting(() => {
  console.log("reconnecting");
});

subscriptionClient.onReconnected(() => {
  console.log("reconnected");
});

subscriptionClient.onDisconnected(() => {
  console.log("disconnected");
  exit(1);
});

// Create a WebSocket link:
const wsLink = new WebSocketLink(subscriptionClient);

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, splitLink)
});
