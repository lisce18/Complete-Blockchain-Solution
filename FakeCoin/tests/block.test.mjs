import hexToBinary from 'hex-to-binary';
import Block from '../models/Block.mjs';
import Blockchain from '../models/Blockchain.mjs';
import { it, describe, expect, beforeEach } from 'vitest';
import { createHash } from '../utilities/crypto-lib.mjs';
import { GENESIS_DATA } from '../config/settings.mjs';

describe('Block', () => {
  const timestamp = Date.now();
  const lastHash = 'previous-hash';
  const hash = 'current-hash';
  const payload = { amount: 10, sender: 'Nisse', recipient: 'Kalle' };
  const nonce = 512;
  const difficulty = parseInt(process.env.DIFFICULTY);
  const mineRate = parseInt(process.env.MINE_RATE);

  const block = new Block({
    timestamp,
    lastHash,
    hash,
    payload,
    nonce,
    difficulty,
  });

  describe('Properties', () => {
    it('should have the properties timestamp, lastHash, hash, payload, nonce, difficulty', () => {
      expect(block).toHaveProperty('timestamp');
      expect(block).toHaveProperty('lastHash');
      expect(block).toHaveProperty('hash');
      expect(block).toHaveProperty('payload');
      expect(block).toHaveProperty('nonce');
      expect(block).toHaveProperty('difficulty');
    });

    it('should have values for each property', () => {
      expect(block.timestamp).toEqual(timestamp);
      expect(block.lastHash).toEqual(lastHash);
      expect(block.hash).toEqual(hash);
      expect(block.payload).toEqual(payload);
      expect(block.nonce).toEqual(nonce);
      expect(block.difficulty).toEqual(difficulty);
    });
  });

  it('should return an instance of a block', () => {
    expect(block instanceof Block).toBe(true);
  });

  describe('Methods', () => {
    describe('createGenesis()', () => {
      const genesis = Block.createGenesis();

      it('should return an instance of the Block class', () => {
        expect(genesis).toBeInstanceOf(Block);
      });

      it('should return the genesis payload', () => {
        expect(genesis).toEqual(GENESIS_DATA);
      });
    });

    describe('mineBlock() function', () => {
      let lastBlock, payload, minedBlock;

      beforeEach(() => {
        lastBlock = Block.createGenesis();
        payload = { message: 'Transaction-test' };
        minedBlock = Block.mineBlock({ lastBlock, payload });
      });

      it('should return a new instance of the Block class', () => {
        expect(minedBlock instanceof Block).toBe(true);
      });

      it('should add a timestamp', () => {
        expect(minedBlock.timestamp).not.toBeUndefined();
      });

      it('should set the lastHash to match the lastBlock hash', () => {
        expect(minedBlock.lastHash).toEqual(lastBlock.hash);
      });

      it('should set the payload', () => {
        expect(minedBlock.payload).toEqual(payload);
      });

      it('should produce a hash that meets the difficulty level', () => {
        const stringToHash = minedBlock.timestamp
          .toString()
          .concat(
            minedBlock.lastHash,
            JSON.stringify(minedBlock.payload),
            minedBlock.nonce,
            minedBlock.difficulty
          );

        expect(minedBlock.hash).toEqual(createHash(stringToHash));
      });
    });

    describe('adjustDifficultyLevel()', () => {
      it('should raise the difficulty level for quickly mined blocks', () => {
        expect(
          Block.adjustDifficultyLevel(block, block.timestamp + mineRate - 100)
        ).toEqual(block.difficulty + 1);
      });

      it('should lower the difficulty level for slow mined block', () => {
        expect(
          Block.adjustDifficultyLevel(block, block.timestamp + mineRate + 100)
        ).toEqual(block.difficulty - 1);
      });
    });
  });
});
