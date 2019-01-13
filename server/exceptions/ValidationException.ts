import BaseException from './BaseException';
import { IException } from '../../index';

export default class ValidationException extends BaseException {
  status = 422;

  constructor(errors: IException[] = []) {
    super('Validation Error', errors);
  }
}
