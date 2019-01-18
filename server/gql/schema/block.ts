import { IResolverObject } from 'graphql-tools';

export const typeDef = `
  type Block {
    id: Int!
    index: Int!
    timestamp: String!
    data: String
    hash: String
    previousHash: String
  }

  extend type Mutation {
    createBlock(index: Int!, timestamp: String!, data: String, hash: String, previousHash: String): Block
  }
`;

export const resolvers: IResolverObject = {
  Mutation: {
    createBlock: () => 'asd',
  },
};
