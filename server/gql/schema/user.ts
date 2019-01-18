import { IResolverObject } from 'graphql-tools';

export const typeDef = `
  type UserProfile {
    name: String
    location: String
    website: String
    picture: String
  }

  type User {
    _id: ID!
    gravatar: String
    email: String!
    profile: UserProfile!
    createdAt: String
    updatedAt: String
  }

  type LoginData {
    auth: Boolean!
    msg: String
    accessToken: String
    user: User
  }

  extend type Mutation {
    login(email: String!, password: String!): LoginData
  }
`;

export const resolvers: IResolverObject = {
  Mutation: {
     login: () => {},
  },
};
