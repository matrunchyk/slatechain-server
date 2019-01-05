import crypto from "crypto";
import { default as User, UserModel, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import "express-validator";
import { sendEmail, EmailMessage } from "../lib/mailer";

export default class AccountController {
  /**
   * POST /account/profile
   * Update profile information.
   */
  static async postUpdateProfile(req: Request, res: Response, next: NextFunction) {
    req.assert("email", "Please enter a valid email address.").isEmail();
    req.sanitize("email").normalizeEmail({gmail_remove_dots: false});

    const errors = req.validationErrors();

    if (errors) {
      return res.status(422).json(errors);
    }

    let user: UserModel;

    try {
      user = await User.findById(req.session.user.id);
    } catch (e) {
      return next(e);
    }

    user.email = req.body.email || "";
    user.profile.name = req.body.name || "";
    user.profile.gender = req.body.gender || "";
    user.profile.location = req.body.location || "";
    user.profile.website = req.body.website || "";

    try {
      await user.save();
    } catch (e) {
      if (e.code === 11000) {
        return res.status(422).json({
          message: "The email address you have entered is already associated with an account."
        });
      }

      return res.status(500).json({
        message: "Unable to save a profile."
      });
    }

    return res.json({
      message: "Profile information has been updated."
    });
  }

  /**
   * POST /account/password
   * Update current password.
   */
  static async postUpdatePassword(req: Request, res: Response, next: NextFunction) {
    // noinspection TypeScriptValidateJSTypes
    req.assert("password", "Password must be at least 8 characters long").len({min: 8});
    req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
      return res.status(422).json(errors);
    }

    let user: UserModel;

    try {
      user = await User.findById(req.session.user.id);
    } catch (e) {
      return next(e);
    }

    user.password = req.body.password;

    try {
      await user.save();
    } catch (e) {

      return res.status(500).json({
        message: "Unable to save a profile."
      });
    }
    return res.json({
      message: "Password has been changed."
    });
  }

  /**
   * POST /account/delete
   * Delete user account.
   */
  static async postDeleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      await User.remove({_id: req.session.user.id});
    } catch (e) {
      return next(e);
    }

    return res.json({
      message: "Your account has been deleted."
    });
  }

  /**
   * POST /forgot
   * Create a random token, then the send user an email with a reset link.
   */
  static async postForgot(req: Request, res: Response, next: NextFunction) {
    req.assert("email", "Please enter a valid email address.").isEmail();
    req.sanitize("email").normalizeEmail({gmail_remove_dots: false});

    const errors = req.validationErrors();

    if (errors) {
      return res.status(422).json(errors);
    }

    let user: UserModel;
    let token: string;

    try {
      const tokenBuf = await crypto.randomBytes(16);
      token = tokenBuf.toString("hex");
    } catch (e) {
      return next(e);
    }

    try {
      user = await User.findOne({email: req.body.email});
    } catch (e) {
      return next(e);
    }

    if (!user) {
      return res.status(422).json({
        msg: "Account with the credentials you have provided not exists.",
      });
    }

    user.passwordResetToken = token;
    user.passwordResetExpires = new Date((new Date()).getTime() + 3600000); // 1 hour

    try {
      await user.save();
    } catch (e) {
      return next(e);
    }

    const msg: EmailMessage = {
      to: user.email,
      from: process.env.SENDGRID_FROM_ADDRESS,
      subject: "Reset your password",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    try {
      await sendEmail(msg);
    } catch (e) {
      return next(e);
    }

    return res.json({
      message: "Please see you email for password recovery link."
    });
  }

  /**
   * GET /reset/:token
   * Reset Password page.
   */
  static async getReset(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
      return res.status(400).json({
        message: "Are sure you want to reset password? You are already logged in."
      });
    }

    let user: UserModel;

    try {
      user = await User
        .findOne({passwordResetToken: req.params.token})
        .where("passwordResetExpires").gt(Date.now())
        .exec();

      if (!user) {
        return res.status(422).json({
          msg: "Reset token is invalid.",
        });
      }
    } catch (e) {
      return next(e);
    }

    return res.json({
      message: "Success"
    });
  }

  /**
   * POST /reset/:token
   * Process the reset password request.
   */
  static async postReset(req: Request, res: Response, next: NextFunction) {
    // noinspection TypeScriptValidateJSTypes
    req.assert("password", "Password must be at least 4 characters long.").len({min: 4});
    req.assert("confirm", "Passwords must match.").equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
      return res.status(422).json(errors);
    }

    let user: UserModel;

    try {
      user = await User
        .findOne({passwordResetToken: req.params.token})
        .where("passwordResetExpires").gt(Date.now())
        .exec();

      if (!user) {
        return res.status(422).json({
          msg: "Reset token is invalid.",
        });
      }
    } catch (e) {
      return next(e);
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    try {
      await user.save();
    } catch (e) {
      return next(e);
    }

    const msg: EmailMessage = {
      to: user.email,
      from: process.env.SENDGRID_FROM_ADDRESS,
      subject: "Your password has been changed",
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };

    try {
      await sendEmail(msg);
    } catch (e) {
      return next(e);
    }

    return res.json({
      message: "Success! Your password has been changed."
    });
  }
}
