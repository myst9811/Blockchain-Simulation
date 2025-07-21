import Blockchain from "./blockchain.js";
import Transaction from "./transaction.js";
import { createWallet, validateWallet } from "./wallet.js";

// initialize the blockchain --> creates the genesis block
console.log("Initializing Blockchain...");
console.log("Creating Genesis Block");
const BLOCKCHAIN = new Blockchain();
console.log("Contents of Blockchain after creating genesis block: \n");
console.log(JSON.stringify(BLOCKCHAIN, null, 4));
console.log("\n---------------------------------------------\n");

console.log("Creating wallets for Alice, Bob, and Charlie...");
const AlicesWallet = createWallet();
const BobsWallet = createWallet();
const CharliesWallet = createWallet();

console.log(
  "validating Bob's wallet... : " +
    validateWallet(BobsWallet.privateKey, BobsWallet.publicKey),
);
console.log(
  "validating Charlie's wallet... : " +
    validateWallet(CharliesWallet.privateKey, CharliesWallet.publicKey),
);
console.log(
  "validating Alicelice's wallet... : " +
    validateWallet(AlicesWallet.privateKey, AlicesWallet.publicKey),
);
console.log("\n----------------------------------------------\n");

BLOCKCHAIN.registerWallet(AlicesWallet.publicKey);
BLOCKCHAIN.registerWallet(BobsWallet.publicKey);
BLOCKCHAIN.registerWallet(CharliesWallet.publicKey);
console.log("\n----------------------------------------------\n");

// Transaction 1
// Transfer 60 coins from Bob to Alice;
console.log(
  "Balance of Alice's wallet: " +
    BLOCKCHAIN.getBalanceOfAddress(AlicesWallet.publicKey) +
    "\n",
);
console.log(
  "Balance of Bob's wallet: " +
    BLOCKCHAIN.getBalanceOfAddress(BobsWallet.publicKey) +
    "\n",
);
console.log("Bob transfers 60 coins to Alice\n");
const tx1 = new Transaction(BobsWallet.publicKey, AlicesWallet.publicKey, 60);
// Bob signs the txn
tx1.signTransaction(BobsWallet.keyPair);
// submit the transaction
BLOCKCHAIN.addTransaction(tx1);
console.log("\n-----------------------------------------------\n");
// Alice mines the block containing tx1.
console.log("⛏️ Alice, acting as the miner, starts working on a new block...");
const solvedBlock1 = BLOCKCHAIN.mineCandidateBlock(AlicesWallet.publicKey);
console.log("✅ Alice has solved the block and presents it for verification.");
console.log("-----------------------------------------------");

BLOCKCHAIN.addBlock(solvedBlock1, AlicesWallet.publicKey);
console.log("\n-----------------------------------------------\n");

// Transaction 2
// Transfer 40 coins from Alice to Bob;
console.log(
  "Balance of Alice's wallet: " +
    BLOCKCHAIN.getBalanceOfAddress(AlicesWallet.publicKey) +
    "\n",
);
console.log(
  "Balance of Bob's wallet: " +
    BLOCKCHAIN.getBalanceOfAddress(BobsWallet.publicKey) +
    "\n",
);
console.log("Alice transfers 40 coins to Bob\n");
const tx2 = new Transaction(AlicesWallet.publicKey, BobsWallet.publicKey, 40);
// Alice signs the txn
tx2.signTransaction(AlicesWallet.keyPair);
// submit the transaction
BLOCKCHAIN.addTransaction(tx2);
console.log("\n-----------------------------------------------\n");
// Now, Bob mines the next block.
console.log("⛏️ Bob, acting as the miner, starts working on a new block...");
const solvedBlock2 = BLOCKCHAIN.mineCandidateBlock(BobsWallet.publicKey);
console.log("✅ Bob has solved the block and it for verification.");
console.log("-----------------------------------------------");

BLOCKCHAIN.addBlock(solvedBlock2, BobsWallet.publicKey);
console.log("\n-----------------------------------------------\n");

console.log("Final Balances:");
console.log(
  `  Alice's wallet: ${BLOCKCHAIN.getBalanceOfAddress(AlicesWallet.publicKey)}`,
);
console.log(
  `  Bob's wallet: ${BLOCKCHAIN.getBalanceOfAddress(BobsWallet.publicKey)}`,
);
console.log(
  `  Charlie's wallet: ${BLOCKCHAIN.getBalanceOfAddress(
    CharliesWallet.publicKey,
  )}`,
);
console.log("\n-----------------------------------------------\n");

// check if blockchain is valid:
console.log("Validating chain...");
console.log("Result: " + BLOCKCHAIN.isChainValid());
console.log("\n-----------------------------------------------\n");

// manually alter data and revalidate;
let balance = BLOCKCHAIN.chain[1].transactions[0].amount;
BLOCKCHAIN.chain[1].transactions[0].amount = 200;
console.log("Manually altered data in second block\nreverifying chain\n");

// check if blockchain valid after tampering.
console.log("Validating chain...");
console.log("Result: " + BLOCKCHAIN.isChainValid());
console.log("\n-----------------------------------------------\n");

// reset the data changed manually :
BLOCKCHAIN.chain[1].transactions[0].amount = balance;

// Print the whole blockchain
console.log("Final blockchain state: \n");
console.log(JSON.stringify(BLOCKCHAIN, null, 4));
