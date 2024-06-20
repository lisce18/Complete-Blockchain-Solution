import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [Block.genesisBlock];
  }

  addBlock({ payload }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain.at(-1),
      payload: payload,
    });
    this.chain.push(newBlock);
    return newBlock;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) return;

    if (!Blockchain.validateChain(chain)) return;

    this.chain = chain;
  }

  static validateChain(chain) {
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.genesisBlock))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, payload, nonce, difficulty } =
        chain.at(i);
      const currentLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== currentLastHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;

      const validHash = createHash(
        timestamp,
        lastHash,
        payload,
        nonce,
        difficulty
      );

      if (hash !== validHash) return false;
    }

    return true;
  }
}
