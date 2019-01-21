import { IResolverObject } from 'graphql-tools';
import NodeController from '../../controllers/NodeController';

export const typeDef = `
  type Peer {
    url: String!
    own: Boolean!
  }

  extend type Query {
    fetchPeers: [Peer!]!
    pingPeers(message: String): String
    askForLatestBlock: Int!
  }

  extend type Mutation {
    addPeer(url: String!): [Peer!]!
  }
`;

export const resolvers: IResolverObject = {
  Query: {
    fetchPeers: NodeController.fetchPeers,
    pingPeers: NodeController.pingPeers,
    askForLatestBlock: NodeController.askForLatestBlock,
  },
  Mutation: {
    addPeer: NodeController.addPeer,
  },
};
