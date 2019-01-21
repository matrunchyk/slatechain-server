import Peer from '../lib/Peer';
import { IPeerProps, IServerContext } from '../../index';

export default class NodeController {
  static fetchPeers(_: any, args: object, { node }: IServerContext): Peer[] {
    return node.peers;
  }

  static addPeer(_: any, { url }: IPeerProps, { node }: IServerContext): Peer[] {
    return node.addPeer(url);
  }

  static pingPeers(_: any, { message }: any, { node }: IServerContext) {
    return node.pingPeers(message);
  }

  static askForLatestBlock(_: any, { message }: any, { node }: IServerContext) {
    let askedCount = 0;

    node.peers.forEach((peer: Peer) => {
      if (!peer.own) {
        askedCount += 1;
        peer.askForLatestBlock();
      }
    });

    return askedCount;
  }
}
