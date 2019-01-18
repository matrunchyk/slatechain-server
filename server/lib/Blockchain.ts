import AbstractModel from './AbstractModel';
import { IBlockchainProps } from '../../index';
import State from './State';
import Block from './Block';
import Transaction from './Transaction';

export default class Blockchain extends AbstractModel {
  private state: State;
  private readonly blocks: Block[];

  constructor({ state = new State({}), blocks = [] }: IBlockchainProps) {
    super();
    this.state = state;
    this.blocks = blocks;
  }

  static verifyTransaction(prev: Transaction, state: State, tx: Transaction) {
    const sender = state.wallets[tx.from] || { amount: 0 };

    if (tx.amount <= 0 || sender.amount < tx.amount) {
      throw Error('Bad amount.');
    }

    if (tx.nonce <  0 || sender.nonce > tx.nonce) {
      throw Error('Bad nonce.');
    }

    if (prev && prev.nonce > tx.nonce) {
      throw Error('Bad nonce order.');
    }

    if (!tx.verify()) {
      throw Error('Transaction is not signed properly.');
    }

    return state.with(tx);
  }

  static verifyBlock(prev: Block, state: State, block: Block) {
    if (prev && block.parentHash !== prev .hash()) {
      throw Error('Bad parentHash.');
    }

    if (prev && block.stateHash  !== state.hash()) {
      throw Error('Bad stateHash.' );
    }

    if (!block.verify()) {
      throw Error('Block is not mined properly.');
    }

    return block.transactions.reduce((state, tx, index) => {
      const prev = block.transactions[index - 1] || (null);

      return Blockchain.verifyTransaction(prev, state, tx);
    }, state.with(block));
  }

  balance(address: string) {
    if (!this.state.wallets[address]) {
      return 0;
    }

    return this.state.wallets[address].amount;
  }

  push(block: Block) {
    const prev = this.blocks[this.blocks.length - 1] || null;

    this.state = Blockchain.verifyBlock(prev, this.state, block);
    this.blocks.push(block);
  }

  mine(minerAddress: string, transactions: Transaction[] = []) {
    const prev = this.blocks[this.blocks.length - 1] || null;

    this.push(new Block({
      parentHash:   prev && prev.hash(),
      stateHash:    this.state.hash(),
      transactions,
      minerAddress,
    }).mine());
  }
}
