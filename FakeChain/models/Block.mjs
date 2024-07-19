import { createHash } from '../utilities/crypto-lib.mjs';

export default class Block {
  constructor({ index, lastHash = '', payload, timestamp }) {
    this.hash = this.hashBlock();
    this.index = index;
    this.lastHash = lastHash;
    this.payload = payload;
    this.timestamp = timestamp;
  }

  hashBlock() {
    return createHash(
      this.index,
      this.lastHash,
      this.timestamp,
      JSON.stringify(this.payload)
    );
  }
}
