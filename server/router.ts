import { Express, Request, Response } from "express";
// @ts-ignore
import { name, version } from "../package.json";

// Controllers (route handlers)
import AuthController from "./controllers/AuthController";
import WalletController from "./controllers/WalletController";
import isAuthenticated from "./middleware/isAuthenticated";

export function bindRoutes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.json({
      name: `${name} v${version}`,
      ts: (new Date().getTime()),
    });
  });

  /**
   * Auth routes.
   */
  app.post("/signup", AuthController.postSignup);
  app.post("/login", AuthController.postLogin);
  app.get("/me", isAuthenticated, AuthController.getMe);

  /**
   * Wallet routes.
   */
  app.get("/wallet", isAuthenticated, WalletController.getTransactions);
  app.get("/wallet/balance", isAuthenticated, WalletController.getBalance);
  app.post("/wallet/transfer", isAuthenticated, WalletController.postTransfer);
}
