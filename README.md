# 🔗 Blockchain Simulation (JavaScript)

A simple blockchain simulation built with **JavaScript**, demonstrating the core concepts of blockchain technology including blocks, transactions, proof of work, wallet registration, mining, consensus, and validation.

---

## 📌 Features

- **Genesis Block**: Automatically created as the first block in the chain.
- **Proof of Work (PoW)**: Simulates mining by finding a valid nonce to match difficulty.
- **Transactions**: Transfer values between wallets with digital signatures.
- **Mining Reward**: Miners receive rewards for successfully mining a block.
- **Wallet Registration**: Nodes (wallets) must be registered to participate in consensus.
- **Consensus Simulation**: Verifiers approve or reject blocks before adding them to the chain.
- **Chain Validation**: Detects tampering in block data, hashes, or transactions.
- **Balance Tracking**: Calculate balances of registered wallet addresses.

---

## 📂 Project Structure

project-root/
│
├── blockchain.js # Blockchain implementation
├── block.js # Block structure and mining logic
├── transaction.js # Transaction structure & validation (not shown here)
├── proofofwork.js # Proof-of-work mining algorithm
└── README.md # Documentation

---
