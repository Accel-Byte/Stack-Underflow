import React from "react";
import App from "./App";
import { ApolloClient, ApolloProvider, InMemoryCache, split} from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from '@apollo/client/link/ws';

let httpLink = createUploadLink({
  uri: 'https://stack-underflow-app.herokuapp.com/graphql'
});

const wsLink = new WebSocketLink({
  uri: 'wss://stack-underflow-app.herokuapp.com/subscriptions',
  options: {
    reconnect: true
  }
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

httpLink = authLink.concat(httpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
