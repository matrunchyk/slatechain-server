import { GraphQLError } from 'graphql';
import { IException, IExceptionBag } from '../../index';

export default class BaseException extends GraphQLError {
  protected state: IExceptionBag;
  protected status = 400;

  constructor(msg: string = 'The request is invalid.', errors?: IException[]) {
    super(msg);

    this.state = (errors || []).reduce((result: IExceptionBag, error: IException) => {
      if (Object.prototype.hasOwnProperty.call(result, error.key)) {
        result[error.key].push(error.message);
      } else {
        result[error.key] = [error.message];
      }
      return result;
    }, {});
  }
}
