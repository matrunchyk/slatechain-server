import AbstractModel from './AbstractModel';
import Blockchain from './Blockchain';
import Peer from './Peer';
import { INodeProps } from '../../index';

export default class Node extends AbstractModel {
  public peers: Peer[];

  private blockchain: Blockchain;

  constructor(opts?: INodeProps) {
    super();

    this.read();
    if (opts) {
      Object.assign(this, opts);
    }

    this.write();
  }

  get props(): string[] {
    return ['peers'];
  }

  addPeer(peer: Peer) {
    this.peers.push(peer);
    this.write();
    this.peers.forEach(peer => peer.broadcast(this.blockchain.prevBlock));

    return this.peers;
  }
}
