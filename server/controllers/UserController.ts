import { IServerContext, IUserData } from '../../index';

export default class UserController {

  static fetchUser(_: any, args: object, { user }: IServerContext): IUserData {
    return user.userData;
  }

  static fetchBalance(_: any, args: object, { user, blockchain }: IServerContext) {
    return (blockchain.state.wallets[user.userData.wallet.publicKey] || { amount: 0}).amount;
  }
}
