import hexToBinary from 'hex-to-binary';
import { GENESIS_DATA, MINE_RATE } from '../config/settings.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';

export default class Block {
  constructor({ timestamp, lastHash, hash, payload, nonce, difficulty }) {
    Object.assign(this, {
      timestamp,
      lastHash,
      hash,
      payload,
      nonce,
      difficulty,
    });
  }

  static get genesisBlock() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, payload }) {
    let { difficulty } = lastBlock;
    let hash, timestamp;
    let nonce = 0;
    const lastHash = lastBlock.hash;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        previousBlock: lastBlock,
        timestamp,
      });
      hash = createHash(timestamp, lastHash, payload, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty)
    );

    return new this({
      timestamp,
      lastHash,
      hash,
      payload,
      nonce,
      difficulty,
    });
  }

  static adjustDifficulty({ previousBlock, timestamp }) {
    const { difficulty } = previousBlock;

    if (timestamp - previousBlock.timestamp > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }
}
