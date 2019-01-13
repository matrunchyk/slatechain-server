import BaseException from './BaseException';

export default class UnauthorizedException extends BaseException {
  status = 401;
}
