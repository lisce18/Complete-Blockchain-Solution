import Transaction from './Transaction.mjs';
import Block from '../models/Block.mjs';
import BlockchainModel from '../models/BlockchainModel.mjs';
import { MINING_REWARD, REWARD_ADDRESS } from '../config/settings.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';
import { GENESIS_BLOCK } from '../config/settings.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [GENESIS_BLOCK];
    this.pendingTransactions = [];
    this.loadBlockchain();
  }

  async loadBlockchain() {
    try {
      const blockchain = await BlockchainModel.findOne();
      if (blockchain) {
        this.chain = blockchain.chain;
        this.pendingTransactions = blockchain.pendingTransactions;
      } else {
        await this.saveBlockchain();
      }
    } catch (error) {
      console.error('Failed to load blockchain from MongoDB:', error);
    }
  }

  async saveBlockchain() {
    try {
      let blockchain = await BlockchainModel.findOne();
      if (blockchain) {
        blockchain.chain = this.chain;
        blockchain.pendingTransactions = this.pendingTransactions;
      } else {
        blockchain = new BlockchainModel({
          chain: this.chain,
          pendingTransactions: this.pendingTransactions,
        });
      }
      await blockchain.save();
    } catch (error) {
      console.error('Failed to save blockchain to MongoDB:', error);
    }
  }

  async addNewBlock() {
    const lastBlock = this.getLastBlock();
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const index = lastBlock.index + 1;
    const payload = [...this.pendingTransactions];

    const rewardTransaction = new Transaction({
      amount: MINING_REWARD,
      sender: 'system',
      recipient: REWARD_ADDRESS,
    });
    payload.push(rewardTransaction);

    const newBlock = new Block({
      index,
      lastHash,
      payload,
      timestamp,
      hash: createHash(this.index, this.lastHash, this.payload, this.timestamp),
    });

    this.chain.push(newBlock);
    this.pendingTransactions = [];

    await this.saveBlockchain();

    return newBlock;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  initTrx(details) {
    return new Transaction(details);
  }

  addNewTrx(transaction) {
    this.pendingTransactions.push(transaction);
    return this.getLastBlock().index + 1;
  }

  listAllTrx() {
    return this.chain.flatMap((block) => block.payload);
  }

  async updateChain(newChain) {
    if (
      newChain.length <= this.chain.length ||
      !Blockchain.isChainValid(newChain)
    ) {
      return;
    }

    this.chain = newChain;
    await this.saveBlockchain();
  }

  static isChainValid(newChain) {
    if (
      newChain.length === 0 ||
      JSON.stringify(newChain[0]) !== JSON.stringify(GENESIS_BLOCK)
    ) {
      return false;
    }

    for (let i = 1; i < newChain.length; i++) {
      const { index, lastHash, timestamp, hash, payload } = newChain[i];
      const newChainLastHash = newChain[i - 1].hash;

      if (lastHash !== newChainLastHash) {
        return false;
      }

      const validatedHash = createHash(
        index,
        lastHash,
        timestamp.toString(),
        JSON.stringify(payload)
      );
      if (hash !== validatedHash) {
        return false;
      }
    }

    return true;
  }
}
