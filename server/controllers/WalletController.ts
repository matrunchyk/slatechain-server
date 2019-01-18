import { Request, Response } from 'express';

export default class WalletController {

  static fetchTransactions(req: Request, res: Response) {
    res.json({});
  }

  /**
   * POST /wallet/transfer
   * Transfers amount to another account.
   */
  static postTransfer(req: Request, res: Response) {
    res.json({
      myBalance: 1000,
    });
  }

  /**
   * GET /wallet/balance
   * Retrieves current balance.
   */
  static getBalance(req: Request, res: Response) {
    res.json({
      myBalance: 2000,
    });
  }

  /**
   * GET /wallet
   * Transactions history page.
   */
  static getTransactions(req: Request, res: Response) {
    res.json([]);
  }
}
