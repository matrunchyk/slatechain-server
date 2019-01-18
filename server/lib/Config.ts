import dotenv from 'dotenv';

dotenv.config({path: '.env'});

export default class Config {
  public static readonly NODE_NAME = process.env['NODE_NAME'] || 'default';
  public static readonly HTTP_HOST = process.env['HTTP_HOST'] || '127.0.0.1';
  public static readonly HTTP_PORT = process.env['HTTP_PORT'] ? +process.env['HTTP_PORT'] : 3000;
}

