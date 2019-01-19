import AbstractModel from './AbstractModel';
import { IPeerProps } from '../../index';
import Block from './Block';

export default class Peer extends AbstractModel {
  private url: string;

  constructor({ url }: IPeerProps) {
    super();
    this.url = url;
  }

  get props(): string[] {
    return ['url'];
  }

  broadcast(prevBlock: Block) {
    console.log(`Broadcasting block to ${this.url}/graphql...`);
  }
}
