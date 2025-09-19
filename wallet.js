import sha256 from "crypto-js/sha256.js";
import Transaction from "./transaction.js";
// Fix: Change the elliptic import from named import to default import
import pkg from 'elliptic';
const { ec: EC } = pkg;

// Create a global ec instance that can be used by both the class and standalone functions
const ec = new EC('secp256k1');

export default class Wallet {
  constructor() {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic('hex');
    this.privateKey = this.keyPair.getPrivate('hex');
  }

  signTransaction(transaction) {
    if (transaction.fromAddress !== this.publicKey) {
      throw new Error('You cannot sign transactions for other wallets!');
    }

    const hashTx = transaction.calculateHash();
    const sig = this.keyPair.sign(hashTx, 'base64');
    transaction.signature = sig.toDER('hex');
  }

  getBalance(blockchain) {
    return blockchain.getBalanceOfAddress(this.publicKey);
  }

  sendMoney(amount, payeeAddress, blockchain) {
    if (this.getBalance(blockchain) < amount) {
      throw new Error('Not enough balance');
    }

    const transaction = new Transaction(this.publicKey, payeeAddress, amount);
    this.signTransaction(transaction);
    blockchain.addTransaction(transaction);
  }
}

// Standalone function that uses the global ec instance
export function createWallet() {
  const keyPair = ec.genKeyPair();
  return {
    publicKey: keyPair.getPublic('hex'),
    privateKey: keyPair.getPrivate('hex'),
    keyPair: keyPair
  };
}

// Function to validate a wallet's key pair
export function validateWallet(wallet) {
  try {
    // Check if wallet has required properties
    if (!wallet.publicKey || !wallet.privateKey || !wallet.keyPair) {
      return false;
    }
    
    // Verify that the public key matches the key pair
    const derivedPublicKey = wallet.keyPair.getPublic('hex');
    return derivedPublicKey === wallet.publicKey;
  } catch (error) {
    console.error('Wallet validation error:', error.message);
    return false;
  }
}