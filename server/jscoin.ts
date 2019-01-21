import Server from './lib/Server';
import Blockchain from './lib/Blockchain';
import Node from './lib/Node';
import User from './lib/User';
import Config from './lib/Config';

(() => {
  const blockchain = new Blockchain();
  const user = new User();
  const node = new Node({ blockchain });
  const httpServer = new Server(node, user, blockchain);

  httpServer.boot(Config.HTTP_HOST, Config.HTTP_PORT);
})();
