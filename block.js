import sha256 from "crypto-js/sha256.js";

const SHA256 = sha256;

export default class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce,
    ).toString();
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }

  mineBlock(difficulty, height) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(
      "Block " +
        (height + 1) +
        " mined, nonce: " +
        this.nonce +
        ", hash: " +
        this.hash,
    );
  }
}
