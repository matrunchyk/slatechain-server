import { IncomingMessage, ServerResponse } from 'http';
import { GraphQLError } from 'graphql';

export type JWTPayload = {
  id: string,
  iat: number,
  exp: number,
};

export type LoginCredentials = {
  email: string,
  password: string,
};

export interface ResolverContext extends IncomingMessage {
  res: ServerResponse;
}

export interface IException {
  key: string;
  message: string;
}

export interface IExceptionBag {
  [key: string]: string[];
}

export interface IGraphQLError extends GraphQLError {
  state: IExceptionBag;
  status: number;
  originalError: IGraphQLError;
}

export interface IIncomingMessage extends IncomingMessage {
  session: any;
}
