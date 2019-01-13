import mongoose from 'mongoose';
import { UserModel } from './User';

export type TransactionModel = mongoose.Document & {
  _id: string,
  date: Date,
  recipient: UserModel,
  sender: UserModel,
  amount: number,
  dollar_amount: number,
};

const transactionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: Date,
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: Number,
  dollar_amount: Number,
}, { timestamps: true });

const Transaction = mongoose.model<TransactionModel>('Transaction', transactionSchema);
export default Transaction;
