import AbstractModel from './AbstractModel';
import Blockchain from './Blockchain';
import { INodeProps } from '../../index';

export default class Node extends AbstractModel {
  private name: string;
  private blockchain: Blockchain;

  constructor({ name, blockchain }: INodeProps) {
    super();
    this.name = name;
    this.blockchain = blockchain;
  }
}
