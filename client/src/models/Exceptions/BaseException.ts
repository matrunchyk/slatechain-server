export default class BaseException extends Error {
  public message: string = '';

  constructor(message: string) {
    super(message);
    this.stack = (new Error()).stack;
  }
}
