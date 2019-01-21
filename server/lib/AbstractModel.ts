import Db from '../util/db';
import pick from 'lodash.pick';

export default abstract class AbstractModel {
  private db: Db;

  // Protected
  protected constructor() {
    this.db = new Db(this);
  }

  protected abstract get props(): string[];

  protected update(data: string | object) {
    return Object.assign(this, typeof data === 'string' ? JSON.parse(data) : data);
  }

  // Public
  public toObject(props: string[] = []): object {
    return pick(this, (props && props.length ? props : this.props) || []);
  }

  public toString(props: string[] = []) {
    return JSON.stringify(this.toObject((props && props.length ? props : this.props) || []));
  }

  public write(props: string[] = []) {
    const dataToWrite = this.toString();

    this.db.write(dataToWrite);
  }

  public read() {
    return this.db.read(this);
  }
}
