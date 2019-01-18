import { IncomingMessage, ServerResponse } from 'http';
import { GraphQLError } from 'graphql';
import Transaction from './server/lib/Transaction';
import State from './server/lib/State';
import Block from './server/lib/Block';
import Blockchain from './server/lib/Blockchain';

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

export interface IWalletProps {
  publicKey: string;
  privateKey: string;
}

export interface ITransactionProps {
  to: string;
  from: string;
  amount: number;
  nonce: number;
  signature: string;
}

export interface IBlockProps {
  parentHash: string;
  stateHash: string;
  minerAddress: string;
  transactions: Transaction[];
  nonce?: number;
}

export interface IWalletData {
  amount: number;
  nonce?: number;
}

export interface IStateWallet {
  [key: string]: IWalletData;
}

export interface IStateProps {
  wallets?: IStateWallet;
}

export interface IBlockchainProps {
  state?: State;
  blocks?: Block[];
}

export interface INodeProps {
  name: string;
  blockchain: Blockchain;
}
