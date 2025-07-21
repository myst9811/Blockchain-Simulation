import Blockchain from "./blockchain";
import Transaction from "./transaction";
import { createWallet, validateWallet } from "./wallet";

// initialize the blockchain --> creates the genesis block
console.log("Initializing Blockchain...");
console.log("Creating Genesis Block");
const BLOCKCHAIN = new Blockchain();
console.log("Contents of Blockchain");
console.log(JSON.stringify(BLOCKCHAIN, null, 4));

// setup wallet for Alice and Bob;
const BobsWallet = createWallet();
const AlicesWallet = createWallet();

console.log("validating Bob's wallet....");
console.log(
  "Bob's wallet is valid: " +
    validateWallet(BobsWallet.privateKey, BobsWallet.publicKey),
);

console.log("validating Alice's wallet....");
console.log(
  "Alice's wallet is valid: " +
    validateWallet(AlicesWallet.privateKey, AlicesWallet.publicKey),
);

// Transaction 1
// Transfer 60 coins from Bob to Alice;
const tx1 = new Transaction(BobsWallet.publicKey, AlicesWallet.publicKey, 60);
// Bob signs the txn
tx1.signTransaction(BobsWallet.keyPair);
// submit the transaction
BLOCKCHAIN.addTransaction(tx1);

// mine the first block;
// miner is Alice;
console.log("Starting mining of block 1 with Alice as miner");
BLOCKCHAIN.minePendingTransaction(AlicesWallet.publicKey);

// Transaction 2
// Transfer 40 coins from Alice to Bob;
const tx2 = new Transaction(AlicesWallet.publicKey, BobsWallet.publicKey, 40);
// Alice signs the txn
tx2.signTransaction(AlicesWallet.keyPair);
// submit the transaction
BLOCKCHAIN.addTransaction(tx2);

// mine the second block
// miner is Bob
console.log("Starting mining of block 2 with Bob as miner");
BLOCKCHAIN.minePendingTransaction(BobsWallet.publicKey);

// Transaction 3
// Transfer 100 coins from Bob to Alice;
const tx3 = new Transaction(BobsWallet.publicKey, AlicesWallet.publicKey, 100);
// Bob signs the txn
tx3.signTransaction(BobsWallet.keyPair);
// submit the transaction
BLOCKCHAIN.addTransaction(tx3);

// mine the third block;
// miner is Alice;
console.log("Starting mining of block 2 with Alice as miner");
BLOCKCHAIN.minePendingTransaction(AlicesWallet.publicKey);

// get balance of Alice's Wallet
console.log(
  "Balance of Alice's wallet: " +
    BLOCKCHAIN.getBalanceOfAddress(AlicesWallet.publicKey),
);

// check if blockchain is valid:
console.log("Validating chain...");
console.log("Result: " + BLOCKCHAIN.isChainValid());

// manually alter data and revalidate;
BLOCKCHAIN.chain[1].transactions[0].amount = 200;

// check if blockchain valid after tampering.
console.log("Validating chain...");
console.log("Result: " + BLOCKCHAIN.isChainValid());

// Print the whole blockchain
console.log(JSON.stringify(BLOCKCHAIN, null, 4));
