import { RawLocation } from 'vue-router';
import { Vue } from 'vue/types/vue';
import { Collection } from 'collect.js';
import Transaction from '@/models/Transaction';
import { UserModel } from '../../server/lib/User';

export interface IUserData {
  name: string;
  address: string;
}

export interface ITransaction {
  _id: number;
  date: string;
  direction: string;
  recipient: UserModel;
  sender: UserModel;
  amount: number;
  dollar_amount?: number;
}

export interface IJsonWebToken {
  exp: number;
}

export interface IVDatatableProps {
  expanded: boolean;
  item: Transaction;
}

export type NextFunction = (to?: RawLocation | false | ((vm: Vue) => any) | void) => void;

export interface LoginData {
  auth: boolean;
  msg?: string;
  accessToken?: string;
  user: UserModel;
}

export interface State {
  user: UserModel | null;
  authenticated: boolean;
}

export interface ICollection<M> extends Collection<M> {}
