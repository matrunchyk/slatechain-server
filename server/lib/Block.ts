import { IBlockProps } from '../../index';
import { createHash } from 'crypto';
import Transaction from './Transaction';
import AbstractModel from './AbstractModel';

const BLOCK_DIFFICULTY = 4;

export default class Block extends AbstractModel {
  public minerAddress: string;
  public parentHash: string;
  public stateHash: string;
  public transactions: Transaction[];

  private nonce: number;

  constructor(
    {
      parentHash = null,
      stateHash = null,
      minerAddress = null,
      nonce = 0,
      transactions = []
  }: IBlockProps) {
    super();

    this.parentHash = parentHash;
    this.stateHash = stateHash;
    this.minerAddress = minerAddress;
    this.nonce = nonce;
    this.transactions = transactions;
  }

  hash() {
    const transactions = JSON.stringify(this.transactions.map(tx => tx.hash()));

    return createHash('SHA256')
      .update(
        `${this.toString(['parentHash', 'stateHash', 'minerAddress', 'nonce'])}${transactions}`
      )
      .digest('hex');
  }

  mine(min = 0, max = Number.MAX_SAFE_INTEGER) {
    for (let nonce = min; nonce <= max; nonce++) {
      const block = new Block({
        ...this.toObject(),
        nonce,
      });

      if (block.verify()) {
        return block;
      }
    }
  }

  verify() {
    const mask = '0'.repeat(BLOCK_DIFFICULTY);

    return this.hash().startsWith(mask);
  }
}
