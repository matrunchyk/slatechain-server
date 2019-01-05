import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";

export function validateUserPassword(user: any, candidatePassword: string) {
  return new Promise((reject, resolve) => {
    bcrypt.compare(candidatePassword, user.password, (err: mongoose.Error, isMatch: boolean) => {
      if (err || !isMatch) {
        return reject(err);
      }
      return resolve(isMatch);
    });
  });
}
