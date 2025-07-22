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
      this.block.nonce = nonce;

      hash = this.block.calculateHash();

      if (hash.substring(0, difficulty) === target) {
        console.log(
          `Block ${height + 1} mined! Nonce: ${nonce}, Hash: ${hash}`,
        );
        return { nonce, hash };
      }
      nonce++;
    }
  }
}
