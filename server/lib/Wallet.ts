import { createECDH } from 'crypto';
import { IWalletProps } from '../../index';

export default class Wallet {
  private publicKey: string;
  private privateKey: string;

  constructor({ publicKey, privateKey }: IWalletProps) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
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
