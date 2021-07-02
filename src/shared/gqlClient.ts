/* istanbul ignore file */
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from 'apollo-boost';
import { fetch } from 'cross-fetch';
import { config } from 'dotenv';

config();

const link = ApolloLink.from([
  new HttpLink({ uri: process.env.GRAPHQL_URL ?? '', fetch }),
]);

const cache = new InMemoryCache();

export const client = new ApolloClient({ link, cache });
