import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import mongoose from "mongoose";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./lib/secrets";
import { bindRoutes } from "./router";

const MongoSessionStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({path: ".env"});

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

(async () => {
  try {
    await mongoose.connect(mongoUrl, {useMongoClient: true});
  } catch (e) {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + e);
  }
})();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoSessionStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

bindRoutes(app);

export default app;
