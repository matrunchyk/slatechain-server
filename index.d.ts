import { IncomingMessage, ServerResponse } from 'http';
import { GraphQLError } from 'graphql';
import Transaction from './server/lib/Transaction';
import State from './server/lib/State';
import Block from './server/lib/Block';
import Blockchain from './server/lib/Blockchain';
import Wallet from './server/lib/Wallet';
import Peer from './server/lib/Peer';
import Node from './server/lib/Node';
import User from './server/lib/User';

export type JWTPayload = {
  exp: number,
  iat: number,
  id: string,
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
  originalError: IGraphQLError;
  state: IExceptionBag;
  status: number;
}

export interface IIncomingMessage extends IncomingMessage {
  session: any;
}

export interface IWalletProps {
  privateKey: string;
  publicKey: string;
}

export interface ITransactionProps {
  amount: number;
  from: string;
  nonce?: number;
  signature?: string;
  to: string;
}

export interface IMineBlockArgs {
  minerAddress: string;
  transactions: Transaction[];
}

export interface ISendAmountArgs {
  from: string;
  to: string;
  amount: number;
}

export interface IBlockProps extends IMineBlockArgs {
  nonce?: number;
  parentHash: string;
  stateHash: string;
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
  blocks?: Block[];
  state?: State;
}

export interface IPeerProps {
  url: string;
}

export interface INodeProps {
  blockchain: Blockchain;
  peers: Peer[];
}

export interface IUserData {
  address: string;
  name: string;
  wallet: Wallet;
}

export interface IServerContext extends IncomingMessage {
  blockchain: Blockchain;
  user: User;
  node: Node;
}
