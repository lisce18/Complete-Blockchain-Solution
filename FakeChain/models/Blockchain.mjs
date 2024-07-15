import { createHash } from '../utilities/crypto-lib.mjs';
import { MINING_REWARD, REWARD_ADDRESS } from '../config/settings.mjs';
import Block from './Block.mjs';
import Transaction from './Transaction.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [Block.createGenesis()];
  }

  async createNewBlock({ payload }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain.at(-1),
      payload,
    });
    this.chain.push(newBlock);
    return newBlock;
  }

  replaceChain(chain, shouldValidate, success) {
    if (chain.length <= this.chain.length) return;

    if (!Blockchain.chainIsValid(chain)) return;

    if (shouldValidate && !this.validateTransactionPayload({ chain })) return;

    if (success) success();

    this.chain = chain;
  }

  validateTransactionPayload({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let counter = 0;

      for (let transaction of block.payload) {
        if (transaction.inputMap.address === REWARD_ADDRESS.address) {
          counter++;

          if (counter > 1) return false;

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD)
            return false;
        } else {
          if (!Transaction.validate(transaction)) {
            return false;
          }

          if (transactionSet.has(transaction)) {
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }

    return true;
  }

  static chainIsValid(chain) {
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.createGenesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, payload, nonce, difficulty } =
        chain.at(i);

      const currentLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== currentLastHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;

      const stringToHash = timestamp
        .toString()
        .concat(lastHash, JSON.stringify(payload), nonce, difficulty);

      const validHash = createHash(stringToHash);

      if (hash !== validHash) return false;
    }

    return true;
  }
}
