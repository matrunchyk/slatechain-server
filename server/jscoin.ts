import Server from './lib/Server';
import Blockchain from './lib/Blockchain';
import Node from './lib/Node';
import User from './lib/User';
import Config from './lib/Config';
import Peer from './lib/Peer';

(() => {
  const peers = [new Peer({ url: `http://${Config.HTTP_HOST}:${Config.HTTP_PORT}/` })];
  const blockchain = new Blockchain();
  const user = new User();
  const node = new Node({ name: Config.NODE_NAME, blockchain, peers });
  const httpServer = new Server(node, user, blockchain);

  httpServer.boot(Config.HTTP_HOST, Config.HTTP_PORT);
})();
