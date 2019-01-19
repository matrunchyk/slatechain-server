import { IResolverObject } from 'graphql-tools';
import BlockchainController from '../../controllers/BlockchainController';
import Config from '../../lib/Config';

export const typeDef = `
  input TransactionInput {
    to: String!
    from: String!
    amount: Int!
    nonce: Int!
    signature: String!
  }

  type Transaction {
    to: String!
    from: String!
    amount: Int!
    nonce: Int!
    signature: String!
  }

  type Block {
    parentHash: String
    stateHash: String!
    minerAddress: String!
    nonce: Int!
    transactions: [Transaction!]!
    hash: String!
  }

  extend type Query {
    fetchBlocks: [Block!]!
    fetchBlockHeight: Int!
    fetchBlockchainDifficulty: Int!
  }

  extend type Mutation {
    createBlock(minerAddress: String!, transactions: [TransactionInput]): Block!
    sendAmount(from: String!, to: String!, amount: Int!): Block!
  }
`;

export const resolvers: IResolverObject = {
  Query: {
    fetchBlockchainDifficulty: () => Config.BLOCK_DIFFICULTY,
    fetchBlockHeight: BlockchainController.fetchBlockHeight,
    fetchBlocks: BlockchainController.fetchBlocks,
  },
  Mutation: {
    createBlock: BlockchainController.mineBlock,
    sendAmount: BlockchainController.sendAmount,
  },
};
