import Server from './lib/Server';
import Blockchain from './lib/Blockchain';
import Node from './lib/Node';
import User from './lib/User';
import Config from './lib/Config';

(() => {
  const blockchain = new Blockchain({});
  const user = new User();
  const node = new Node({ name: Config.NODE_NAME, blockchain });
  const httpServer = new Server(node, user);

  httpServer.boot(Config.HTTP_HOST, Config.HTTP_PORT);
})();
