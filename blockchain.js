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
  const block = new Block(
    Date.now(),
    [...this.pendingTransactions, new Transaction(null, miningRewardAddress, this.miningReward)],
    this.getBlock(this.getHeight()).hash
  );
  
  // Mine the block and get the result
  const miningResult = new ProofOfWork(block).run(this.difficulty, this.getHeight());
  
  // Update the block with the mining results
  block.nonce = miningResult.nonce;
  block.hash = miningResult.hash;
  
  // Return the complete block object
  return block;
}

 addBlock(newBlock, minerPublicKey) {
  // Convert Set to Array before using filter
  const verifiers = Array.from(this.registeredWallets).filter(wallet => wallet !== minerPublicKey);
  
  if (verifiers.length === 0) {
    throw new Error("Not enough registered wallets to reach consensus.");
  }

  console.log("\n📡 Block submitted for network consensus...");
  
  const isValidBlock = this.validateBlock(newBlock);
  const approvals = verifiers.filter(verifier => {
    console.log(`🧐 Wallet ${verifier.substring(0, 10)}... is verifying...`);
    
    if (isValidBlock) {
      console.log(`👍 Wallet ${verifier.substring(0, 10)}... approved.`);
      return true;
    } else {
      console.log(`👎 Wallet ${verifier.substring(0, 10)}... rejected.`);
      return false;
    }
  }).length;

  console.log(`\nResults: ${approvals} out of ${verifiers.length} required approvals.`);

  if (approvals >= verifiers.length) {
    this.chain.push(newBlock);
    this.pendingTransactions = [];
    console.log("🎉 Consensus reached! Block successfully added to the chain.");
    return true;
  } else {
    console.log("❌ Consensus not reached. Block rejected.");
    return false;
  }
}
// Helper method for block validation
validateBlock(block) {
  const latestBlock = this.getBlock(this.getHeight());
  const target = "0".repeat(this.difficulty);
  
  return (
    block.hash.startsWith(target) &&
    block.hash === block.calculateHash() &&
    block.previousHash === latestBlock.hash &&
    block.hasValidTransactions()
  );
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