import { SchemaDirectiveVisitor } from 'graphql-tools';
import { defaultFieldResolver } from 'graphql';
import UnauthorizedException from '../../exceptions/UnauthorizedException';
import { IIncomingMessage, JWTPayload } from '../../../index';
import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '../../lib/secrets';
import { default as User } from '../../models/User';

export const typeDef = `
  directive @auth on FIELD_DEFINITION
`;

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: any) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = async (...args: any[]) => {
      const [, , context]  = args;

      await AuthDirective.validateToken(context);
      return resolve.apply(this, args);
    };
  }

  static async validateToken(context: IIncomingMessage) {
    const authHeader = context.headers['authorization'] || '';
    const tokenData = authHeader.split('Bearer ');
    const token = tokenData.length === 2 ? tokenData[1] : '';

    context.session.user = null;

    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header provided.');
    }

    if (tokenData.length !== 2) {
      throw new UnauthorizedException('Authorization header must be a valid Bearer token');
    }

    let payload: JWTPayload;

    try {
      // @ts-ignore
      payload = await jwt.verify(token, JWT_PRIVATE_KEY);
    } catch (e) {
      throw new UnauthorizedException('Invalid token provided.');
    }

    const userAttributes = [
      '-password',
      '-__v',
      '-tokens',
    ];

    try {
      context.session.user = await User.findById(payload.id)
        .select(userAttributes)
        .exec();
    } catch (e) {
      throw new UnauthorizedException('There was a problem finding the user.');
    }
  }
}
