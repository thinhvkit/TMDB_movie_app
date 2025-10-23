import {HttpLink} from '@apollo/client/link/http';
import {ApolloClient, InMemoryCache} from '@apollo/client';

// Replace with your GraphQL server URL
const GRAPHQL_URI = 'http://localhost:4000/graphql';

export const graphqlClient = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URI,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
