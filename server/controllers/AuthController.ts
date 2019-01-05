import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { JWT_PRIVATE_KEY, JWT_TTL } from "../lib/secrets";
import { validateUserPassword } from "../lib/helpers";
import { EmailMessage, sendEmail } from "../lib/mailer";

export default class AuthController {
  /**
   * POST /signup
   * Create a new account.
   */
  static async postSignup(req: Request, res: Response, next: NextFunction) {
    req.assert("email", "Email is not valid").isEmail();
    // noinspection TypeScriptValidateJSTypes
    req.assert("password", "Password must be at least 8 characters long").len({min: 8});
    req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);
    req.sanitize("email").normalizeEmail({gmail_remove_dots: false});

    const errors = req.validationErrors();

    if (errors) {
      return res.status(422).json(errors);
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    try {
      const existingUser = await User.findOne({email: req.body.email});

      if (existingUser) {
        return res.status(422).json({
          msg: "Account with that email address already exists.",
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
      subject: "Welcome to JsCoin",
      text: `Hello,\n\nWe are happy to have you on board!.\n`
    };
    try {
      await sendEmail(msg);
    } catch (e) {
    }

    // create a token
    const token = jwt.sign({ id: user._id }, JWT_PRIVATE_KEY, {
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
  static async postLogin(req: Request, res: Response, next: NextFunction) {
    req.assert("email", "Email is not valid").isEmail();
    req.assert("password", "Password cannot be blank").notEmpty();
    req.sanitize("email").normalizeEmail({gmail_remove_dots: false});

    const errors = req.validationErrors();

    if (errors) {
      return res.status(422).send(errors);
    }

    try {
      const existingUser = await User.findOne({email: req.body.email});

      if (!existingUser) {
        return res.status(422).json({
          msg: "Account with the credentials you have provided not exists.",
        });
      }

      try {
        await validateUserPassword(existingUser, req.body.password);
      } catch (e) {
        return res.status(401).send({
          auth: false,
          msg: "Account with the credentials you have provided not exists.",
        });
      }

      // create a token
      const token = jwt.sign({ id: existingUser._id }, JWT_PRIVATE_KEY, {
        expiresIn: JWT_TTL,
      });

      res.status(200).send({
        auth: true,
        token,
      });
    } catch (e) {
      return next(e);
    }
  }
}
