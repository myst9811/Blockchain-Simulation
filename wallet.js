import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

export function createWallet() {
  const keyPair = ec.genKeyPair();
  return {
    publicKey: keyPair.getPublic("hex"),
    privateKey: keyPair.getPrivate("hex"),
    keyPair,
  };
}

export function validateWallet(privateKey, publicKey) {
  try {
    const key = ec.keyFromPrivate(privateKey);
    const publicKeyFromPrivateKey = key.getPublic("hex");
    return publicKeyFromPrivateKey === publicKey;
  } catch (error) {
    return false;
  }
}