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
