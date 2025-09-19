import sha256 from "crypto-js/sha256.js";
const SHA256 = sha256;

export default class ProofOfWork {
  constructor(block) {
    this.block = block;
  }

  run(difficulty, height) {
    const target = "0".repeat(difficulty);
    let nonce = 0;
    
    console.log("Mining new block...");
    while (true) {
      this.block.nonce = nonce;
      const hash = this.block.calculateHash();

      if (hash.startsWith(target)) {
        console.log(
          `Block ${height + 1} mined! Nonce: ${nonce}, Hash: ${hash}`,
        );
        return { nonce, hash };
      }
      nonce++;
    }
  }
}