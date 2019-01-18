import Db from '../util/db';

export default class AbstractModel {
  private db: Db;

  constructor() {
    this.db = new Db(this);
  }

  toObject() {
    return Object.assign(this);
  }

  toString(props: string[] = []) {
    return JSON.stringify(this, props);
  }

  static fromJson(data: string) {
  }

  save() {
    this.db.write(this.toObject());
  }

  read() {
    return this.db.read(this.toObject());
  }
}
