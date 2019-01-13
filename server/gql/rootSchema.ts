import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs, resolvers, schemaDirectives } from './loader';
import { Types } from 'mongoose';

const { ObjectId } = Types;
ObjectId.prototype.valueOf = function () {
  return this.toString();
};

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives,
});
