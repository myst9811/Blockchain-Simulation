import Block from "./block.js";
import Transaction from "./transaction.js";
import ProofOfWork from "./proofofwork.js";

export default class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.registeredWallets = new Set(); // Use a Set for faster lookups
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], "0");
  }

  getHeight() {
    return this.chain.length - 1;
  }

  getBlock(height) {
    return this.chain[height];
  }

  registerWallet(publicKey) {
    if (!this.registeredWallets.has(publicKey)) {
      this.registeredWallets.add(publicKey);
      console.log(`✅ Wallet registered: ${publicKey.substring(0, 15)}...`);
    }
  }

  addTransaction(transaction) {
    if (!transaction || !transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }
    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transactions to chain");
    }
    this.pendingTransactions.push(transaction);
  }

  mineCandidateBlock(miningRewardAddress) {
    const latestBlock = this.getBlock(this.getHeight());
    const transactionsToMine = [
      ...this.pendingTransactions,
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];

    const block = new Block(Date.now(), transactionsToMine, latestBlock.hash);
    const pow = new ProofOfWork(block);
    
    // The ProofOfWork class now directly returns the mined block.
    // The nonce and hash are updated inside the pow.run method.
    return pow.run(this.difficulty, this.getHeight());
  }

  addBlock(newBlock, minerPublicKey) {
    const verifiers = [...this.registeredWallets].filter(
      (wallet) => wallet !== minerPublicKey
    );
    const requiredApprovals = verifiers.length;

    if (requiredApprovals === 0) {
      throw new Error("Not enough registered wallets to reach consensus.");
    }
    console.log("\n📡 Block submitted for network consensus...");

    const latestBlock = this.getBlock(this.getHeight());
    const target = "0".repeat(this.difficulty);
    let approvalCount = 0;

    for (const verifierPublicKey of verifiers) {
      console.log(
        `🧐 Wallet ${verifierPublicKey.substring(0, 10)}... is verifying the block...`
      );

      if (
        newBlock.hash.startsWith(target) &&
        newBlock.hash === newBlock.calculateHash() &&
        newBlock.previousHash === latestBlock.hash &&
        newBlock.hasValidTransactions()
      ) {
        console.log(
          `👍 Wallet ${verifierPublicKey.substring(0, 10)}... approved.`
        );
        approvalCount++;
      } else {
        console.log(
          `👎 Wallet ${verifierPublicKey.substring(0, 10)}... rejected.`
        );
      }
    }

    console.log(
      `\nResults: ${approvalCount} out of ${requiredApprovals} required approvals.`
    );

    if (approvalCount >= requiredApprovals) {
      this.chain.push(newBlock);
      this.pendingTransactions = [];
      console.log("🎉 Consensus reached! Block successfully added to the chain.");
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
        } else if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    // Skip the genesis block as it has no previous block to validate against
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Recompute the hash to check if the data has been tampered with
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log("🚨 Tampered chain: Block hash mismatch.");
        return false;
      }
      
      // Verify that the current block's previous hash points to the previous block's actual hash
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log("🚨 Tampered chain: Previous hash link is broken.");
        return false;
      }
      
      // Check all transactions in the block
      if (!currentBlock.hasValidTransactions()) {
        console.log("🚨 Tampered chain: Invalid transactions found.");
        return false;
      }
    }
    return true;
  }
}