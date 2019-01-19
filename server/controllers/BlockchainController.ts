import { IMineBlockArgs, ISendAmountArgs, IServerContext } from '../../index';
import Block from '../lib/Block';
import logger from '../util/logger';
import Transaction from '../lib/Transaction';

export default class BlockchainController {

  static mineBlock(_: any, { minerAddress, transactions = [] }: IMineBlockArgs, { blockchain }: IServerContext) {
    const prev = blockchain.blocks[blockchain.blocks.length - 1] || null;
    const minedBlock = new Block({
      parentHash:   prev && prev.hash(),
      stateHash:    blockchain.state.hash(),
      transactions,
      minerAddress,
    }).mine();

    logger.debug('Mining completed!');
    blockchain.push(minedBlock);

    return minedBlock;
  }

  static sendAmount(_: any, { from, to, amount }: ISendAmountArgs, ctx: IServerContext) {
    const transactions = [new Transaction({
      from,
      to,
      amount,
    })];

    return BlockchainController.mineBlock(_, { minerAddress: from, transactions }, ctx);
  }

  static fetchBlockHeight(_: any, args: any, { blockchain }: IServerContext) {
    return blockchain.blocks.length;
  }

  static fetchBlocks(_: any, args: any, { blockchain }: IServerContext) {
    return blockchain.blocks;
  }
}
