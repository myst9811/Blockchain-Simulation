const SHA256 = require("crypto-js/sha256");

export default class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = [];
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = "";
  }

  calculateHash() {
    return SHA256(
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce,
    );
  }
}
