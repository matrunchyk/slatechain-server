import faker from 'faker';
import AbstractModel from './AbstractModel';
import { IUserData } from '../../index';
import Wallet from './Wallet';

export default class User extends AbstractModel {
  public readonly userData: IUserData;

  constructor() {
    super();

    this.read();
    this.write();
  }

  //noinspection JSMethodCanBeStatic
  get defaults() {
    const wallet = Wallet.create();

    const userData: IUserData = {
      name: faker.name.findName(),
      address: `${faker.address.country()}, ${faker.address.city()}`,
      wallet,
    };

    return {
      userData,
    };
  }

  get props() {
    return ['userData'];
  }

  write() {
    super.write();
  }
}
