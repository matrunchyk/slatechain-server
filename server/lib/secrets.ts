import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";
import moment from "moment";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const JWT_PRIVATE_KEY = process.env["JWT_PRIVATE_KEY"];
export const JWT_TTL = process.env["JWT_TTL"] || moment().add(14, "days").unix(); // expires in 2 weeks;
export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];

if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!JWT_PRIVATE_KEY) {
    logger.error("No jwt private key. Set JWT_PRIVATE_KEY environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
