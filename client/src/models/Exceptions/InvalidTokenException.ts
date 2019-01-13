import BaseException from '@/models/Exceptions/BaseException';

export default class InvalidTokenException extends BaseException {
  constructor() {
    super('Invalid token');
  }
}
