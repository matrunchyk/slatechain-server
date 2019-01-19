import Peer from '../lib/Peer';
import { IPeerProps, IServerContext } from '../../index';

export default class NodeController {

  static fetchPeers(_: any, args: object, { node }: IServerContext): Peer[] {
    return node.peers;
  }

  static addPeer(_: any, { url }: IPeerProps, { node }: IServerContext): Peer[] {
    return node.addPeer(new Peer({ url }));
  }
}
