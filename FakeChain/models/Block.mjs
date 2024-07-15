import hexToBinary from 'hex-to-binary';
import { GENESIS_DATA } from '../config/settings.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';

const mineRate = parseInt(process.env.MINE_RATE);

export default class Block {
  constructor({ timestamp, lastHash, hash, payload, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.payload = payload;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  // Getter... = property...
  static createGenesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, payload }) {
    let hash, timestamp;
    let lastHash = lastBlock.hash;
    let nonce = 512;
    let { difficulty } = lastBlock;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficultyLevel(lastBlock, timestamp);
      const stringToHash = timestamp
        .toString()
        .concat(lastHash, JSON.stringify(payload), nonce, difficulty);

      hash = createHash(stringToHash);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty)
    );

    return new this({ timestamp, lastHash, hash, payload, nonce, difficulty });
  }

  static adjustDifficultyLevel(lastBlock, currentTimestamp) {
    let { difficulty } = lastBlock;
    let { timestamp } = lastBlock;
    const elapsedTime = currentTimestamp - timestamp;

    if (difficulty < 1) return 1;

    return elapsedTime > mineRate ? +difficulty - 1 : +difficulty + 1;
  }
}
