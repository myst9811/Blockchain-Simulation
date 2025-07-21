import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

export function createWallet() {
  const keyPair = ec.genKeyPair();
  const publicKey = keyPair.getPublic("hex");
  const privateKey = keyPair.getPrivate("hex");

  return {
    publicKey,
    privateKey,
    keyPair,
  };
}

export function validateWallet(privateKey, publicKey) {
  const key = ec.keyFromPrivate(privateKey);

  // derive publicKey from privateKey
  const publicKeyFromPrivateKey = key.getPublic("hex");
  return publicKeyFromPrivateKey === publicKey;
}
