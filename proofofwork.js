import sha256 from "crypto-js/sha256.js";
const SHA256 = sha256;

export default class ProofOfWork {
  constructor(block) {
    this.block = block;
  }

  run(difficulty, height) {
    const target = Array(difficulty + 1).join("0");
    let nonce = 0;
    let hash = "";

    console.log("Mining new block...");
    while (true) {
      // Set the nonce on the block instance
      this.block.nonce = nonce;
      // Calculate the hash with the new nonce
      hash = this.block.calculateHash();

      // Check if the hash meets the target difficulty
      if (hash.substring(0, difficulty) === target) {
        console.log(
          `Block ${height + 1} mined! Nonce: ${nonce}, Hash: ${hash}`,
        );
        // Return the found nonce and hash
        return { nonce, hash };
      }

      // Increment nonce and try again
      nonce++;
    }
  }
}
