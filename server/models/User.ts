import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mongoose from 'mongoose';

export type UserModel = mongoose.Document & {
  _id: string,
  email: string,
  password: string,
  passwordResetToken: string,
  passwordResetExpires: Date,

  tokens: AuthToken[],

  profile: {
    name: string,
    location: string,
    website: string,
    picture: string
  },

  comparePassword: comparePasswordFunction,
  gravatar: (size: number) => string
};

type comparePasswordFunction = (candidatePassword: string) => Promise<any>;

export type AuthToken = {
  accessToken: string,
  kind: string
};

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  tokens: Array,

  profile: {
    name: String,
    location: String,
    website: String,
    picture: String
  }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', async function save(next) {
  //@ts-ignore
  const user: UserModel = this;
  const saltRounds = 10;

  if (!user.isModified('password') || !user.isNew) {
    return next();
  }

  try {
    user.password = await bcrypt.hash(user.password, saltRounds);
  } catch (e) {
    return next(e);
  }

  next();
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function () {
  const size = 200;

  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }

  const md5 = crypto.createHash('md5').update(this.email).digest('hex');

  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model<UserModel>('User', userSchema);
export default User;
