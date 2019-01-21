import Block from '../lib/Block';

const ASN_PRIVATE_HDR = '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';
const ASN_PRIVATE_SUFFIX = 'a144034200';
const ASN_PUBLIC_HDR = '3056301006072a8648ce3d020106052b8104000a034200';

export function privateKeyToPem(sender: string, key: string) {
  const k = Buffer.from(
    `${ASN_PRIVATE_HDR}${key}${ASN_PRIVATE_SUFFIX}${sender}`,
    'hex').toString('base64');

  return `-----BEGIN PRIVATE KEY-----\n${k}\n-----END PRIVATE KEY-----`;
}

export function publicKeyToPem(sender: string) {
  const k = Buffer.from(
    `${ASN_PUBLIC_HDR}${sender}`,
    'hex').toString('base64');

  return `-----BEGIN PUBLIC KEY-----\n${k}\n-----END PUBLIC KEY-----`;
}

export function getGenesisBlock() {
  return new Block({
    index: 0,
    minerAddress: '04f5caf0c9ae9fe0492859a37312be9f0d3db44854c1e264114e26458440cd629df3ccca470b2ea37aef352d7e38bc8f09c06e4ff0c2d781defe6ff0a1ce16bf4f',
    parentHash: null,
    stateHash: '821bf06b4dcb406ea508a4a992eadc22f29850cd208ba24aea7c29148de8ccf1',
    transactions: [],
    nonce: 719086,
  });
}
