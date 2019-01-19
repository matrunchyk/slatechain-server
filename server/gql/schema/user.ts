import { IResolverObject } from 'graphql-tools';
import UserController from '../../controllers/UserController';

export const typeDef = `
  type Wallet {
    publicKey: String!
    privateKey: String!
  }

  type User {
    name: String!
    address: String!
    wallet: Wallet
  }

  extend type Query {
    fetchUser: User!
    fetchBalance: Int!
  }
`;

export const resolvers: IResolverObject = {
  Query: {
    fetchUser: UserController.fetchUser,
    fetchBalance: UserController.fetchBalance,
  },
};
