import WebSocket from 'ws';
import AbstractModel from './AbstractModel';
import Blockchain from './Blockchain';
import Peer from './Peer';
import Config from './Config';
import { IBlockProps, INodeProps, IPeerProps, ISocketControlMessage } from '../../index';
import logger from '../util/logger';
import { MessageType } from '../util/constants';
import Block from './Block';

export default class Node extends AbstractModel {
  public peers: Peer[];

  private blockchain: Blockchain;
  private server: WebSocket.Server;

  // Public
  public constructor(opts?: INodeProps) {
    super();

    if (opts) {
      Object.assign(this, opts);
    }

    this.read();
    this.write();
    this.startServer();
  }

  public addPeer(url: string) {
    logger.debug(`Adding peer: ${url}`);
    // Skip if exists
    if (this.peers.find(p => p.url === url)) {
      logger.debug(`...skipped, we already have it.`);
      return this.peers;
    }

    const newPeer = new Peer({ node: this, url });

    this.peers.push(newPeer);
    this.write();

    return this.peers;
  }

  public broadcastLatestBlock() {
    this.peers.forEach((peer: Peer) => {
      if (peer.own) {
        return;
      }
      peer.respondWithBlocks([this.blockchain.prevBlock]);
    });
  }

  // Interconnection routing
  public onMessage(json: string = '{type: ""}', peer: Peer) {
    const message: ISocketControlMessage = JSON.parse(json);

    switch (message.type) {
      case MessageType.QUERY_LATEST_BLOCK:
        logger.debug(`⬇️  Requested to send the latest block... ${peer.clientAddress}`);
        peer.respondWithBlocks(this.blockchain.prevBlock ? [this.blockchain.prevBlock] : []);
        break;

      case MessageType.QUERY_ALL_BLOCKS:
        logger.debug(`⬇ ️ Requested to send the whole blockchain... ${peer.clientAddress}`);
        peer.respondWithBlocks(this.blockchain.blocks);
        break;

      case MessageType.SEND_PEERS:
        logger.debug(`⬇️  Received peers ${peer.clientAddress}`);
        message.peers.forEach(peerProps => this.addPeer(peerProps.url));

        break;

      case MessageType.SEND_BLOCKS:
        logger.debug(`⬇️  Received ${message.blocks.length} block(s)...${peer.clientAddress}`);

        const receivedBlocks = message.blocks
          .map((blockProps: IBlockProps) => new Block(blockProps))
          .sort((b1, b2) => (b1.index - b2.index));
        const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
        const latestBlockHeld = this.blockchain.prevBlock;

        if (latestBlockReceived.index > latestBlockHeld.index) {
          logger.debug(`The blockchain is possibly behind. We got: ${latestBlockHeld.index}. Peer got: ${latestBlockReceived.index}`);

          if (latestBlockHeld.hash() === latestBlockReceived.parentHash) {
            console.log('Appending the received block to our chain...');
            this.blockchain.push(latestBlockReceived);
            this.broadcastLatestBlock();
          } else if (receivedBlocks.length === 1) {
            console.log('We have to query the chain from our peer');
            peer.askForAllBlocks();
          } else {
            console.log('Received blockchain is longer than current blockchain');
            this.blockchain.replace(receivedBlocks);
            this.blockchain.write();
          }
        } else {
          logger.debug(`⬇️  Received blockchain (ver. ${latestBlockReceived.index}) is not longer than current blockchain (ver. ${latestBlockHeld.index}). Skipping`);
        }
        break;

      default:
        logger.debug(`⬇️  Cannot understand what they need us to do. The type is unknown: ${message.type}`);
        break;
    }
  }

  public removePeer(url: string) {
    logger.debug(`Removing peer: ${url}`);
    // TODO: Close connection
    this.peers = this.peers.filter(p => p.url !== url);
    this.write();
  }

  public pingPeers(message: string = 'PING') {
    logger.debug(`Pinging peers...`);
    this.peers.forEach(peer => peer.ping(message));
  }

  // Protected
  protected get props(): string[] {
    return ['peers'];
  }

  //noinspection JSMethodCanBeStatic
  protected get defaults(): INodeProps {
    return {
      blockchain: this.blockchain,
      peers: <Peer[]> [],
    };
  }

  protected update(data: string | object) {
    const node: Node = super.update(data);

    // Instantiate peers
    logger.debug('Instantiating peers...');
    node.peers = node.peers.map((peerOpts: IPeerProps) => new Peer({...peerOpts, node }));
    return node;
  }

  // Private
  private startServer() {
    this.server = new WebSocket.Server({ host: Config.P2P_HOST, port: Config.P2P_PORT });
    this.server.on('connection', this.onIncomingConnection.bind(this));
    console.log(
      '  P2P Server is running at ws://%s:%d',
      Config.P2P_HOST,
      Config.P2P_PORT,
    );
  }

  private onIncomingConnection(ws: WebSocket) {
    // Build Peer interface
    const myPeer = new Peer({ ws, node: this });

    myPeer.askForLatestBlock();
    myPeer.sendPeers();

    // Set up handlers with connecting peer
    ws.on('message', (data: string) => this.onMessage(data, myPeer));
    ws.on('close', function(code: number, reason: string) {
      console.log('-----CLOSE-----');
      console.log(`Connection to ${this.url} closed. Reason: ${reason}. Code: ${code}`);
    });
    ws.on('error', function(err: Error) {
      console.log('-----ERROR-----');
      console.log(`Connection error to ${this.url}. ${err}`);
    });
  }
}
