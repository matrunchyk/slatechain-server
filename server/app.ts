import express from 'express';
import compression from 'compression';
import session from 'express-session';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import cors from 'cors';
import dotenv from 'dotenv';
import mongo from 'connect-mongo';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import schema from './gql/rootSchema';
import bluebird from 'bluebird';
import { MONGODB_URI, SESSION_SECRET } from './lib/secrets';
import { IGraphQLError } from '../index';

const MongoSessionStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({path: '.env'});

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

(async () => {
  try {
    await mongoose.connect(mongoUrl, {useMongoClient: true});
  } catch (e) {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + e);
  }
})();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoSessionStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

// GraphQL configuration
const extensions = () => {
  return {
    runTime: Date.now(),
  };
};

app.use('/graphql', graphqlHTTP(() => ({
  schema,
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


export default app;
