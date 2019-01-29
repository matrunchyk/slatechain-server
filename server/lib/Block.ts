import { createHash } from 'crypto';
import Transaction from './Transaction';
import AbstractModel from './AbstractModel';
import { IBlockProps } from '../..';
import logger from '../util/logger';
import Config from './Config';

export default class Block extends AbstractModel {
  public index: number = 0;
  public minerAddress: string = null;
  public parentHash: string = null;
  public stateHash: string = null;
  public transactions: Transaction[] = [];

  private nonce: number = 0;

  // Protected
  protected get props() {
    return ['parentHash', 'stateHash', 'minerAddress', 'nonce', 'index'];
  }

  // Public
  public constructor(props?: IBlockProps) {
    super();

    if (props) {
      Object.assign(this, props);
    }
  }

  public static fromJSON(data: any) {
    const block = new Block();

    Object.assign(block, data);
    block.transactions = block.transactions
      .map((transaction: Transaction) => Transaction.fromJSON(transaction));

    return block;
  }

  public hash() {
    const transactions = JSON.stringify(this.transactions.map(tx => tx.hash()));

    return createHash('SHA256')
      .update(
        `${this.toString()}${transactions}`
      )
      .digest('hex');
  }

  public mine(min = 0, max = Number.MAX_SAFE_INTEGER) {
    logger.debug('Mining block...');

    const blockData = this.toObject() as IBlockProps;
    const { transactions } = this;

    // PoW algo
    for (let nonce = min; nonce <= max; nonce++) {
      const block = new Block({
        ...blockData,
        transactions,
        nonce,
      });

      if (block.verify()) {
        return block;
      }
    }
  }

  public verify() {
    const mask = '0'.repeat(Config.BLOCK_DIFFICULTY);

    return this.hash().startsWith(mask);
  }
}
