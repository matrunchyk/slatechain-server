import jwt from 'jsonwebtoken';

import { default as User } from '../models/User';
import { Request, Response, NextFunction } from 'express';
import { JWT_PRIVATE_KEY } from '../lib/secrets';
import { JWTPayload } from '../../index';

export default async function isAuthenticated (req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({
      auth: false,
      message: 'No token provided.',
    });
  }
  let payload: JWTPayload;

  try {
    // @ts-ignore
    payload = await jwt.verify(token, JWT_PRIVATE_KEY);
  } catch (e) {

    return res.status(401).send({
      auth: false,
      message: 'Failed to authenticate token.',
    });
  }

  const hiddenUserAttributes = [
    '-password',
    '-__v',
    '-tokens',
  ];

  try {
    req.session.user = await User.findById(payload.id)
      .select(hiddenUserAttributes)
      .exec();

    if (req.session.user) {
      next();
    }

    return res.status(404).send({
      message: 'No user found.',
    });

  } catch (e) {
    console.log(e.constructor.name);
    console.log(e.name);

    return res.status(500).send({
      message: 'There was a problem finding the user.',
    });
  }
}
