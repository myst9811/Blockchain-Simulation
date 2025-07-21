import sha256 from "crypto-js/sha256.js";
const SHA256 = sha256;
import Elliptic from "elliptic";

const ec = new Elliptic.ec("secp256k1");

export default class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets");
    }

    // sign txn hash with private key;
    this.hash = this.calculateHash();
    const sign = signingKey.sign(this.hash, "base64");

    // convert sign to DER format
    this.signature = sign.toDER("hex");
    console.log("Signature: " + this.signature);
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    // transcode fromAddres to get public key
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");

    // verify if transaction was initiated by this public key, by verifying signature;
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
