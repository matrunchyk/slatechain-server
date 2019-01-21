import WebSocket from 'ws';
import chalk from 'chalk';
import Node from './Node';
import { MessageType } from '../util/constants';
import Config from './Config';
import logger from '../util/logger';
import Block from './Block';
import { IPeerProps } from '../../index';

export default class Peer {
  public node: Node;
  public ws: WebSocket;
  public url: string;
  public reconnectCount: number = 0;
  public own: boolean = false;

  // Public
  public get clientAddress() {
    // @ts-ignore
    return this.ws._socket ? chalk`{hex('#666') [${this.ws._socket.remoteAddress}:${this.ws._socket.remotePort}]}` : '';
  }

  public constructor(opts?: IPeerProps) {
    if (opts) {
      Object.assign(this, opts);
    }

    // If this is our own URL or WS is already established, skip
    if (this.url === Config.MY_PEER_URL || this.ws) {
      this.own = true;
      return;
    }

    logger.debug(`Connecting to peer: ${this.url}`);
    this.initConnection();
  }

  public toJSON() {
    return {
      url: this.url,
    };
  }

  public askForLatestBlock() {
    // @ts-ignore
    logger.debug(`⬆️  Asking for the latest block... ${this.clientAddress}`);

    this.sendMessage({
      type: MessageType.QUERY_LATEST_BLOCK,
    });
  }

  public askForAllBlocks() {
    logger.debug('⬆️  Asking for the all blocks...');
    this.sendMessage({
      type: MessageType.QUERY_ALL_BLOCKS,
    });
  }

  public sendPeers() {
    logger.debug(`⬆️  Sending ${this.node.peers.length} peers...`);
    this.sendMessage({
      type: MessageType.SEND_PEERS,
      peers: this.node.peers,
    });
  }

  public respondWithBlocks(blocks: Block[]) {
    logger.debug(`⬆️  Sending ${blocks.length} blocks...`);

    this.sendMessage({
      type: MessageType.SEND_BLOCKS,
      blocks,
    });
  }

  public ping(message: any) {
    // TODO: Use WS ping/pong protocol instead
    this.sendMessage(message);
  }

  // Private
  private initConnection() {
    this.ws = new WebSocket(this.url);

    this.ws.on('open', this.onConnection.bind(this));
    this.ws.on('message', data => this.node.onMessage.call(this.node, data, this));
    this.ws.on('ping', function () {
      console.log('--- PEER PING ---');
    });
    this.ws.on('close', function () {
      console.log('--- PEER CLOSE ---');
    });
    this.ws.on('error', this.onConnectionError.bind(this));
  }

  private onConnection() {
    logger.debug(`Connected to peer ${this.url}!`);

    this.askForLatestBlock();
    this.sendPeers();
  }

  private onConnectionError() {
    logger.debug(`Connection error with peer ${this.url}!`);

    if (this.reconnectCount >= 5) {
      logger.debug(`Too much retries, removing the peer.`);
      this.node.removePeer(this.url);
      return;
    }
    setTimeout(() => {
      this.reconnectCount += 1;
      logger.debug(`Retry #${this.reconnectCount}...`);
      this.initConnection();
    }, 1000);
  }

  private sendMessage(message: any) {
    if (this.ws.readyState !== 1) {
      logger.debug('Unabled to send the message. The socket is closed.');
      return;
    }

    this.ws.send(JSON.stringify(message));
  }
}
