import jwt from 'jsonwebtoken';
import validator from 'validator';
import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { JWT_PRIVATE_KEY, JWT_TTL } from '../lib/secrets';
import { EmailMessage, sendEmail } from '../lib/mailer';
import { IException, LoginCredentials } from '../../index';
import ValidationException from '../exceptions/ValidationException';

export default class AuthController {
  /**
   * POST /signup
   * Create a new account.
   */
  static async postSignup(req: Request, res: Response, next: NextFunction) {
    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    try {
      const existingUser = await User.findOne({email: req.body.email});

      if (existingUser) {
        return res.status(422).json({
          msg: 'Account with that email address already exists.',
        });
      }

    } catch (e) {
      return next(e);
    }

    try {
      user.save();
    } catch (e) {
      return next(e);
    }

    const msg: EmailMessage = {
      to: req.body.email,
      from: process.env.SENDGRID_FROM_ADDRESS,
      subject: 'Welcome to JsCoin',
      text: `Hello,\n\nWe are happy to have you on board!.\n`
    };
    try {
      await sendEmail(msg);
    } catch (e) {
    }

    // create a token
    const token = jwt.sign({id: user._id}, JWT_PRIVATE_KEY, {
      expiresIn: JWT_TTL,
    });

    res.status(200).send({
      auth: true,
      token,
    });
  }

  /**
   * GET /me
   * Retrieves a logged in user
   */
  static getMe(req: Request, res: Response) {
    return res.json(req.session.user);
  }

  /**
   * POST /login
   * Sign in using email and password.
   */
  static async postLogin(parent: any, {email, password}: LoginCredentials) {
    const errors: IException[] = [];

    if (!validator.isEmail(email)) {
      errors.push({key: 'email', message: 'The email address is not valid.'});
    }

    if (validator.isEmpty(password)) {
      errors.push({key: 'password', message: 'The password shouldn\'t be blank.'});
    }

    if (errors.length) {
      throw new ValidationException(errors);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      return {
        auth: false,
        msg: 'Account with the credentials you have provided not exists.',
      };
    }

    try {
      await existingUser.comparePassword(password);
    } catch (e) {
      console.log(e);
      return {
        auth: false,
        msg: 'Account with the credentials you have provided not exists.',
      };
    }

    // create a token
    const accessToken = jwt.sign({id: existingUser._id}, JWT_PRIVATE_KEY, {
      expiresIn: JWT_TTL,
    });

    return {
      auth: true,
      accessToken,
      user: existingUser,
    };
  }
}
