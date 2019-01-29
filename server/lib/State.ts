import { createHash } from 'crypto';
import Transaction from './Transaction';
import AbstractModel from './AbstractModel';
import Block from './Block';
import Config from './Config';
import { IStateProps, IStateWallet } from '../..';

export default class State extends AbstractModel {
  public readonly wallets: IStateWallet = {};

  constructor(opts?: IStateProps) {
    super();

    if (opts) {
      Object.assign(this, opts);
    }
  }

  get props(): string[] {
    return ['wallets'];
  }

  static fromJSON(data: any) {
    const state = Object.assign(new State(), data);

    Object.keys(state.wallets).forEach((key: string) => {
      Object.assign(state.wallets, {
        [key]: state.wallets[key],
      });
    });

    return state;
  }

  hash() {
    const wallets = Object.keys(this.wallets).sort();
    const head = JSON.stringify(wallets);
    const tail = JSON.stringify(wallets.map(wl => this.wallets[wl]));

    return createHash('SHA256')
      .update(head + tail)
      .digest('hex');
  }

  with(mt: Transaction | Block) {
    if (mt instanceof Transaction) {
      const sender = this.wallets[mt.from] || {amount: 0, nonce: 0};
      const target = this.wallets[mt.to] || {amount: 0, nonce: 0};

      return new State({ ...this.toObject(), wallets: { ...this.wallets,
          [mt.from]: {amount: sender.amount - mt.amount, nonce: sender.nonce + 1},
          [mt.to]: {amount: target.amount + mt.amount, nonce: target.nonce},
        }});
    } else {
      const miner = this.wallets[mt.minerAddress] || { amount: 0, nonce: 0 };

      return new State({ ...this.toObject(), wallets: { ...this.wallets,
          [mt.minerAddress]: {...miner, amount: miner.amount + Config.BLOCK_REWARD},
        }});
    }
  }
}
