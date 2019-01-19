import { createECDH } from 'crypto';
import { IWalletProps } from '../../index';

export default class Wallet {
  public publicKey: string = '';
  public privateKey: string = '';

  constructor(opts?: IWalletProps) {
    if (opts) {
      Object.assign(this, opts);
    }
  }

  static fromJSON(data: any) {
    return Object.assign(new Wallet(), data);
  }

  static create() {
    const keyPair = createECDH('secp256k1');

    keyPair.generateKeys();

    return new Wallet({
      publicKey: keyPair.getPublicKey('hex'),
      privateKey: keyPair.getPrivateKey('hex'),
    });
  }
}
