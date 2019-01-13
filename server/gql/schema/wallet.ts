import { IResolverObject } from 'graphql-tools';
import WalletController from '../../controllers/WalletController';

export const typeDef = `
  enum TransactionDirection {
    INCOMING
    OUTGOING
  }

  type SeededData {
    transactions: Int!
    users: Int!
  }

  type Transaction {
    _id: ID!
    date: String!
    direction: TransactionDirection!
    recipient: User!
    sender: User!
    amount: Float!
    dollar_amount: Float!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    fetchTransactions: [Transaction!]! @auth
  }

  extend type Mutation {
    seedDatabase: SeededData
  }
`;

export const resolvers: IResolverObject = {
  Query: {
    fetchTransactions: WalletController.fetchTransactions,
  },
  Mutation: {
    seedDatabase: WalletController.seedDatabase,
  },
};
