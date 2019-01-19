import AbstractModel from '../lib/AbstractModel';
import Config from '../lib/Config';
import logger from './logger';

const fs = require('fs-extra');
const path = require('path');

export default class Db {
  private readonly prototype: AbstractModel;
  private readonly filePath: string;

  constructor(prototype: AbstractModel) {
    this.prototype = prototype;
    this.filePath = `data/${Config.NODE_NAME}/${prototype.constructor.name.toLowerCase()}.json`;
  }

  read(prototype: any): any {
    logger.debug(`Loading data from ${this.filePath}...`);
    if (!fs.existsSync(this.filePath)) {
      logger.debug(`...no file exists, fallback to defaults`);
      return prototype.update(prototype.defaults);
    }

    const fileContent: Buffer = fs.readFileSync(this.filePath);
    if (fileContent.length === 0) {
      logger.debug(`...file is empty, fallback to defaults`);
      return prototype.update(prototype.defaults);
    }

    logger.debug(`...done, updating a caller`);
    return prototype.update(fileContent.toString('utf8'));
  }

  write(data: string) {
    fs.ensureDirSync(path.dirname(this.filePath));
    logger.debug(`Writing data to ${this.filePath}:`);
    fs.writeFileSync(this.filePath, data);
    logger.debug(`...done`);
  }

  // Exclude DB from any serialization
  toJSON(): undefined {
    return undefined;
  }
}
