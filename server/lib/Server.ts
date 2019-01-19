import express, { Express } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import errorHandler from 'errorhandler';
import schema from '../gql/rootSchema';
import User from './User';
import Node from './Node';
import Blockchain from './Blockchain';
import { IGraphQLError } from '../../index';

export default class Server {
  private app: Express;

  constructor(node: Node, user: User, blockchain: Blockchain) {
    // Create Express server
    this.app = express();

    // Express configuration
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(lusca.xframe('SAMEORIGIN'));
    this.app.use(lusca.xssProtection(true));

    const extensions = (info: any) => {
      return {
        runTime: Date.now() - info.context.startTime
      };
    };

    this.app.use('/graphql', graphqlHTTP(() => ({
      schema,
      context: {
        node,
        user,
        blockchain,
        startTime: Date.now(),
      },
      graphiql: process.env.NODE_ENV === 'DEVELOPMENT',
      formatError: (error: IGraphQLError) => ({
        message: error.message,
        state: error.originalError && error.originalError.state,
        status: error.originalError && error.originalError.status,
        locations: error.locations,
        path: error.path,
      }),
      extensions,
    })));

    this.app.use(errorHandler());
  }

  boot(host: string, port: number) {
    this.app.listen(port, host, () => {
      console.log(
        '  App is running at http://%s:%d',
        host,
        port,
      );
      console.log('  Press CTRL-C to stop\n');
    });
  }
}
