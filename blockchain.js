import Block from "./block.js";
import Transaction from "./transaction.js";
import ProofOfWork from "./proofofwork.js";

export default class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.registeredWallets = [];
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

  registerWallet(publicKey) {
    if (!this.registeredWallets.includes(publicKey)) {
      this.registeredWallets.push(publicKey);
      console.log(`✅ Wallet registered: ${publicKey.substring(0, 15)}...`);
    }
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

  mineCandidateBlock(miningRewardAddress) {
    const latestBlock = this.getBlock(this.getHeight());

    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward,
    );

    const transactionsToMine = [...this.pendingTransactions, rewardTx];

    let block = new Block(Date.now(), transactionsToMine, latestBlock.hash);

    const pow = new ProofOfWork(block);
    const { nonce, hash } = pow.run(this.difficulty, this.getHeight());

    block.nonce = nonce;
    block.hash = hash;

    return block;
  }

  addBlock(newBlock, minerPublicKey) {
    let approvalCount = 0;
    const requiredApprovals = this.registeredWallets.length - 1;

    if (requiredApprovals <= 0) {
      throw new Error("Not enough registered wallets to reach consensus.");
    }

    console.log("\n📡 Block submitted for network consensus...");

    // Every wallet except the miner must verify the block
    for (const verifierPublicKey of this.registeredWallets) {
      if (verifierPublicKey === minerPublicKey) {
        continue; // The miner doesn't need to self-verify
      }

      console.log(
        `🧐 Wallet ${verifierPublicKey.substring(0, 10)}... is verifying the block...`,
      );

      // We perform the standard validation checks for each verifier
      const latestBlock = this.getBlock(this.getHeight());
      const target = Array(this.difficulty + 1).join("0");

      if (
        newBlock.hash.substring(0, this.difficulty) === target &&
        newBlock.hash === newBlock.calculateHash() &&
        newBlock.previousHash === latestBlock.hash &&
        newBlock.hasValidTransactions()
      ) {
        console.log(
          `👍 Wallet ${verifierPublicKey.substring(0, 10)}... approved.`,
        );
        approvalCount++;
      } else {
        console.log(
          `👎 Wallet ${verifierPublicKey.substring(0, 10)}... rejected.`,
        );
      }
    }

    console.log(
      `\nResults: ${approvalCount} out of ${requiredApprovals} required approvals.`,
    );

    // Check if consensus was reached
    if (approvalCount >= requiredApprovals) {
      this.chain.push(newBlock);
      this.pendingTransactions = [];
      console.log(
        "🎉 Consensus reached! Block successfully added to the chain.",
      );
      return true;
    } else {
      console.log("❌ Consensus not reached. Block rejected.");
      return false;
    }
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
