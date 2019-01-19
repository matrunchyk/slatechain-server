import Db from '../util/db';
import pick from 'lodash.pick';

export default abstract class AbstractModel {
  private db: Db;

  protected constructor() {
    this.db = new Db(this);
  }

  abstract get props(): string[];

  toObject(props: string[] = []): object {
    return pick(this, (props && props.length ? props : this.props) || []);
  }

  toString(props: string[] = []) {
    return JSON.stringify(this.toObject((props && props.length ? props : this.props) || []));
  }

  update(data: string | object) {
    return Object.assign(this, typeof data === 'string' ? JSON.parse(data) : data);
  }

  write(props: string[] = []) {
    const dataToWrite = this.toString();

    this.db.write(dataToWrite);
  }

  read() {
    return this.db.read(this);
  }
}
