import dotenv from 'dotenv';

dotenv.config({path: '.env'});

export default class Config {
  public static readonly NODE_NAME = process.env['NODE_NAME'] ? process.env['NODE_NAME'].replace(/[^\w]|_/gi, '') : 'default';
  public static readonly HTTP_HOST = process.env['HTTP_HOST'] || '127.0.0.1';
  public static readonly HTTP_PORT = process.env['HTTP_PORT'] ? +process.env['HTTP_PORT'] : 3000;
  public static readonly P2P_HOST = process.env['P2P_HOST'] || '127.0.0.1';
  public static readonly P2P_PORT = process.env['P2P_PORT'] ? +process.env['P2P_PORT'] : 5000;
  public static readonly BLOCK_DIFFICULTY = process.env['BLOCK_DIFFICULTY'] ? +process.env['BLOCK_DIFFICULTY'] : 5;
  public static readonly BLOCK_REWARD = process.env['BLOCK_REWARD'] ? +process.env['BLOCK_REWARD'] : 10;
  public static readonly PEER_MAX_RECONNECT_COUNT = process.env['PEER_MAX_RECONNECT_COUNT'] ? +process.env['PEER_MAX_RECONNECT_COUNT'] : 10;
  public static readonly MY_PEER_URL = `ws://${Config.P2P_HOST}:${Config.P2P_PORT}`;
}

