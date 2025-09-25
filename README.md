# Blockchain Simulation

A simple blockchain implementation in JavaScript demonstrating core blockchain concepts including blocks, transactions, proof of work, and consensus mechanisms.

## Features

- **Genesis Block**: Automatically created first block
- **Proof of Work**: Mining with adjustable difficulty
- **Transactions**: Digital signatures and wallet transfers
- **Mining Rewards**: Compensation for successful miners
- **Consensus**: Network validation before adding blocks
- **Chain Validation**: Tamper detection and integrity checks
- **Balance Tracking**: Real-time wallet balance calculations

## Installation

```bash
git clone <repository-url>
cd blockchain-simulation
npm install
```

## Usage

```javascript
const Blockchain = require("./src/blockchain");
const Transaction = require("./src/transaction");

// Create blockchain
const blockchain = new Blockchain();

// Add transaction
const transaction = new Transaction("alice", "bob", 50);
blockchain.addTransaction(transaction);

// Mine block
blockchain.minePendingTransactions("miner1");

// Check balance
console.log("Alice balance:", blockchain.getBalance("alice"));
```

## Project Structure

```
├── src/
│   ├── blockchain.js      # Main blockchain logic
│   ├── block.js           # Block structure and mining
│   ├── transaction.js     # Transaction handling
│   ├── proofofwork.js     # Mining algorithm
│   └── wallet.js          # Wallet management
├── examples/              # Usage examples
└── tests/                 # Test files
```

## API

### Blockchain

- `new Blockchain()` - Create new blockchain
- `addTransaction(transaction)` - Add transaction to pending pool
- `minePendingTransactions(miningRewardAddress)` - Mine new block
- `getBalance(address)` - Get wallet balance
- `isChainValid()` - Validate entire chain

### Block

- `new Block(timestamp, transactions, previousHash)` - Create block
- `mineBlock(difficulty)` - Mine block with proof of work
- `calculateHash()` - Calculate block hash

### Transaction

- `new Transaction(fromAddress, toAddress, amount)` - Create transaction
- `calculateHash()` - Calculate transaction hash
- `signTransaction(signingKey)` - Sign with private key
- `isValid()` - Validate transaction

## Testing

```bash
npm test
```

## Configuration

```javascript
// Adjust mining difficulty
blockchain.difficulty = 4;

// Set mining reward
blockchain.miningReward = 100;
```

## License

MIT License
