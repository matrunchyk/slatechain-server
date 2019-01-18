import { createHash, createSign, createVerify } from 'crypto';
import { privateKeyToPem, publicKeyToPem } from '../util/utils';
import AbstractModel from './AbstractModel';
import { ITransactionProps } from '../../index';

export default class Transaction extends AbstractModel {
  public date: Date;
  public from: string;
  public to: string;
  public amount: number;
  public nonce: number;
  public signature: string;

  constructor({ from, to, amount, nonce, signature }: ITransactionProps) {
    super();

    this.from = from;
    this.to = to;
    this.amount = amount;
    this.nonce = nonce;
    this.signature = signature;
  }

  hash() {
    return createHash('SHA256')
      .update(this.toString(['from', 'to', 'amount', 'nonce']))
      .digest('hex');
  }

  sign(privateKey: string) {
    const cert = privateKeyToPem(this.from, privateKey);
    const signature = createSign('SHA256')
      .update(this.hash())
      .sign(cert, 'hex');

    return new Transaction({
      ...Object.assign(this),
      signature,
    });
  }

  verify() {
    const pem = publicKeyToPem(this.from);
    const signature = createVerify('SHA256')
      .update(this.hash());

    if (!(this.from) || !(this.signature)) {
      return false;
    }

    return signature.verify(pem, this.signature, 'hex');
  }
}
