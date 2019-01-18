import { Request, Response, NextFunction } from 'express';

export default class AccountController {
  /**
   * POST /account/profile
   * Update profile information.
   */
  static async postUpdateProfile(req: Request, res: Response, next: NextFunction) {
    return res.json({
      message: 'Profile information has been updated.'
    });
  }

  /**
   * POST /account/password
   * Update current password.
   */
  static async postUpdatePassword(req: Request, res: Response, next: NextFunction) {
    return res.json({
      message: 'Password has been changed.'
    });
  }

  /**
   * POST /account/delete
   * Delete user account.
   */
  static async postDeleteAccount(req: Request, res: Response, next: NextFunction) {
    return res.json({
      message: 'Your account has been deleted.'
    });
  }

  /**
   * POST /forgot
   * Create a random token, then the send user an email with a reset link.
   */
  static async postForgot(req: Request, res: Response, next: NextFunction) {
    return res.json({
      message: 'Please see you email for password recovery link.'
    });
  }

  /**
   * GET /reset/:token
   * Reset Password page.
   */
  static async getReset(req: Request, res: Response, next: NextFunction) {
    return res.json({
      message: 'Success'
    });
  }

  /**
   * POST /reset/:token
   * Process the reset password request.
   */
  static async postReset(req: Request, res: Response, next: NextFunction) {
    return res.json({
      message: 'Success! Your password has been changed.'
    });
  }
}
