import { ApolloClient } from "apollo-client";
import { ApolloLink, concat, split } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import fetch from "node-fetch";
import * as ws from "ws";
import { SubscriptionClient } from "subscriptions-transport-ws"; 
import { exit } from "process";

if (!process.env.JWT_TOKEN && !process.env.HASURA_SECRET) {
  throw new Error(
    "Please specify the `JWT_TOKEN` or `HASURA_SECRET` environment variable."
  );
}

const authHeaders = process.env.JWT_TOKEN
  ? { authorization: `Bearer ${process.env.JWT_TOKEN}` }
  : { "x-hasura-admin-secret": process.env.HASURA_SECRET };

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_URL || "data.bonde.devel:3001/graphql",
  fetch
});

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({ headers: authHeaders });
  return forward(operation);
});

const wsClient = new SubscriptionClient(
  process.env.WS_GRAPHQL_URL || "ws://localhost:5007/v1/graphql",
  {
    reconnect: true,
    connectionParams: { headers: authHeaders }
  },
  ws
);

wsClient.onConnecting(() => {
  console.log("connecting");
});

wsClient.onConnected(() => {
  console.log("connected");
});

wsClient.onReconnecting(() => {
  console.log("reconnecting");
});

wsClient.onReconnected(() => {
  console.log("reconnected");
});

wsClient.onDisconnected(() => {
  console.log("disconnected");
  exit(1);
});

// Create a WebSocket link:
const wsLink = new WebSocketLink(wsClient);

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
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

const cache = new InMemoryCache();

export const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, link)
});
