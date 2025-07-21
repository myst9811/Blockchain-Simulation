import Block from "./block.js";
import Transaction from "./transaction.js";

export default class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], "");
  }

  getHeight() {
    return this.chain.length - 1;
  }

  getBlock(height) {
    return this.chain[height];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transactions to chain");
    }

    // add txn to mempool / pendingTransactions;
    this.pendingTransactions.push(transaction);
  }

  minePendingTransaction(miningRewardAddress) {
    // package pending txn in same block;
    const latestBlock = this.getBlock(this.getHeight());

    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      latestBlock.hash,
    );

    // mine constantly.
    block.mineBlock(this.difficulty, this.getHeight());
    this.chain.push(block);

    // reward validator
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log(
          "Hash not valid for block: " + JSON.stringify(currentBlock),
        );
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.calculateHash()) {
        console.log(
          "Previous block hash is not valid for block: " +
            JSON.stringify(currentBlock),
        );
        return false;
      }
    }
    return true;
  }
}
