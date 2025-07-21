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

// setup wallet for Alice and Bob;
const BobsWallet = createWallet();
const AlicesWallet = createWallet();

console.log("validating Bob's wallet....");
console.log(
  "Bob's wallet is valid: " +
    validateWallet(BobsWallet.privateKey, BobsWallet.publicKey),
);
console.log(
  "Balance of Alice's wallet: " +
    BLOCKCHAIN.getBalanceOfAddress(AlicesWallet.publicKey) +
    "\n",
);
console.log("\n---------------------------------------------\n");

console.log("validating Alice's wallet....");
console.log(
  "Alice's wallet is valid: " +
    validateWallet(AlicesWallet.privateKey, AlicesWallet.publicKey),
);
console.log(
  "Balance of Alice's wallet: " +
    BLOCKCHAIN.getBalanceOfAddress(AlicesWallet.publicKey) +
    "\n",
);
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
// mine the first block;
// miner is Alice;
console.log("Starting mining of block 1 with Alice as miner");
BLOCKCHAIN.minePendingTransaction(AlicesWallet.publicKey);
console.log("-----------------------------------------------\n");

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
// mine the second block
// miner is Bob
console.log("Starting mining of block 2 with Bob as miner");
BLOCKCHAIN.minePendingTransaction(BobsWallet.publicKey);
console.log("-----------------------------------------------\n");

// get balance of Alice's Wallet
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

// check if blockchain is valid:
console.log("Validating chain...");
console.log("Result: " + BLOCKCHAIN.isChainValid());
console.log("\n-----------------------------------------------\n");

// manually alter data and revalidate;
let balance = BLOCKCHAIN.chain[1].transactions[0].amount;
BLOCKCHAIN.chain[1].transactions[0].amount = 200;
console.log("Manually altered data in second block\n reverifying chain\n");

// check if blockchain valid after tampering.
console.log("Validating chain...");
console.log("Result: " + BLOCKCHAIN.isChainValid());
console.log("\n-----------------------------------------------\n");

// reset the data changed manually :
BLOCKCHAIN.chain[1].transactions[0].amount = balance;

// Print the whole blockchain
console.log(JSON.stringify(BLOCKCHAIN, null, 4));
