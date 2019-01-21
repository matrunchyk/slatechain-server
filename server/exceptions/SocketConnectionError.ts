import { ISocketConnectionError } from '../../index';

export default class SocketConnectionError extends Error implements ISocketConnectionError {
  public url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }
}
