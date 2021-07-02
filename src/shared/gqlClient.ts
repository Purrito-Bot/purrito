/* istanbul ignore file */
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-boost';
import { fetch } from 'cross-fetch';
import { config } from 'dotenv';

config();

const link = ApolloLink.from([
  new HttpLink({ uri: process.env.GRAPHQL_URL ?? '', fetch }),
]);

const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [],
      },
    },
  }),
});

export const client = new ApolloClient({ link, cache });
