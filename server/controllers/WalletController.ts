import { Request, Response } from 'express';
import faker from 'faker';
import mongoose from 'mongoose';
import User, { UserModel } from '../models/User';
import Transaction, { TransactionModel } from '../models/Transaction';
import { JSC_RATE } from '../lib/constants';
import { IIncomingMessage } from '../../index';
import UnauthorizedException from '../exceptions/UnauthorizedException';

export default class WalletController {

  static async seedDatabase() {

    await User.deleteMany({});
    await Transaction.deleteMany({});

    const transactions = [];
    const users = [];

    for (let i = 0; i < 5; i++) {
      const u = new User({
        _id: new mongoose.Types.ObjectId(),
        email: faker.internet.email().toLowerCase(),
        password: 'FakePassword1!',
        gravatar: faker.image.avatar(),
        profile: {
          name: faker.name.findName(),
          website: faker.internet.url(),
          location: faker.address.streetAddress() + faker.address.city() + faker.address.country(),
          picture: faker.image.avatar(),
        }
      });

      await u.save();
      users.push(u);
    }

    for (let i = 0; i < 50; i++) {
      const amount = Math.floor(Math.random() * 10 + 1);
      const dollar_amount = amount * JSC_RATE;
      const recipient: UserModel[] = await User.aggregate([{ $sample: { size: 1 } }]);
      const sender: UserModel[] = await User.aggregate([{ $sample: { size: 1 } }]);

      const trn = new Transaction({
        _id: new mongoose.Types.ObjectId(),
        date: new Date(),
        recipient: recipient[0]._id,
        sender: sender[0]._id,
        amount,
        dollar_amount,
      });
      await trn.save();
      transactions.push(trn);
    }

    return {
      users: users.length,
      transactions: transactions.length,
    };
  }

  static async fetchTransactions(_: any, args: any, context: IIncomingMessage): Promise<any[]> {
    const { user } = context.session;


    if (!user || !user._id) {
      throw new UnauthorizedException('Only logged in users permitted to access this resource.');
    }

    const transactions = await Transaction.find()
      .or([
        { 'sender': user },
        { 'recipient': user },
      ])
      .populate(['sender', 'recipient'])
      .lean() as TransactionModel[];

    return transactions.map(transaction => {
      Object.assign(transaction, {
        direction: user._id.valueOf() == transaction.sender._id.valueOf() ? 'OUTGOING' : 'INCOMING',
      });

      return transaction;
    });
  }

  /**
   * POST /wallet/transfer
   * Transfers amount to another account.
   */
  static postTransfer(req: Request, res: Response) {
    res.json({
      myBalance: 1000,
    });
  }

  /**
   * GET /wallet/balance
   * Retrieves current balance.
   */
  static getBalance(req: Request, res: Response) {
    res.json({
      myBalance: 2000,
    });
  }

  /**
   * GET /wallet
   * Transactions history page.
   */
  static getTransactions(req: Request, res: Response) {
    res.json([]);
  }
}
