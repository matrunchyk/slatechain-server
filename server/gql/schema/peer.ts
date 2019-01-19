import { IResolverObject } from 'graphql-tools';
import NodeController from '../../controllers/NodeController';

export const typeDef = `
  type Peer {
    url: String!
  }

  extend type Query {
    fetchPeers: [Peer!]!
  }

  extend type Mutation {
    addPeer(url: String!): [Peer!]!
  }
`;

export const resolvers: IResolverObject = {
  Query: {
    fetchPeers: NodeController.fetchPeers,
  },
  Mutation: {
    addPeer: NodeController.addPeer,
  },
};
