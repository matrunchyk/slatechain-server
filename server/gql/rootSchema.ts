import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs, resolvers, schemaDirectives } from './loader';

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives,
});
