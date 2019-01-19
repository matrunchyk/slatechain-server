import { createHash } from 'crypto';
import Transaction from './Transaction';
import AbstractModel from './AbstractModel';
import { IBlockProps } from '../../index';
import logger from '../util/logger';
import Config from './Config';

export default class Block extends AbstractModel {
  public minerAddress: string = null;
  public parentHash: string = null;
  public stateHash: string = null;
  public transactions: Transaction[] = [];

  private nonce: number = 0;

  constructor(props?: IBlockProps) {
    super();

    if (props) {
      Object.assign(this, props);
    }
  }

  get props() {
    return ['parentHash', 'stateHash', 'minerAddress', 'nonce'];
  }

  static fromJSON(data: any) {
    const block = new Block();

    Object.assign(block, data);
    block.transactions = block.transactions
      .map((transaction: Transaction) => Transaction.fromJSON(transaction));

    return block;
  }

  hash() {
    const transactions = JSON.stringify(this.transactions.map(tx => tx.hash()));

    return createHash('SHA256')
      .update(
        `${this.toString()}${transactions}`
      )
      .digest('hex');
  }

  mine(min = 0, max = Number.MAX_SAFE_INTEGER) {
    logger.debug('Mining new block...');

    for (let nonce = min; nonce <= max; nonce++) {
      const block = new Block({
        ...this.toObject() as IBlockProps,
        nonce,
      });

      if (block.verify()) {
        return block;
      }
    }
  }

  verify() {
    const mask = '0'.repeat(Config.BLOCK_DIFFICULTY);

    return this.hash().startsWith(mask);
  }
}
