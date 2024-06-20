import hexToBinary from 'hex-to-binary';
import { describe, it, expect, beforeEach } from 'vitest';
import Block from '../models/Block.mjs';
import { GENESIS_DATA } from '../config/settings.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';

describe('Block', () => {
  const timestamp = Date.now();
  const lastHash = '0';
  const hash = '0';
  const payload = { amount: 5, sender: 'Nisse', recipient: 'Kalle' };
  const nonce = 1;
  const difficulty = 1;

  const block = new Block({
    timestamp,
    lastHash,
    hash,
    payload,
    nonce,
    difficulty,
  });

  describe('Properties', () => {
    it('should have a the properties timestamp, lastHash, hash, payload, nonce, difficulty', () => {
      expect(block).toHaveProperty('timestamp');
      expect(block).toHaveProperty('lastHash');
      expect(block).toHaveProperty('hash');
      expect(block).toHaveProperty('payload');
      expect(block).toHaveProperty('nonce');
      expect(block).toHaveProperty('difficulty');
    });

    it('should have the values for each proprty', () => {
      expect(block.timestamp).toEqual(timestamp);
      expect(block.lastHash).toEqual(lastHash);
      expect(block.hash).toEqual(hash);
      expect(block.payload).toEqual(payload);
      expect(block.nonce).toEqual(nonce);
      expect(block.difficulty).toEqual(difficulty);
    });
  });

  describe('Genesis Block', () => {
    const genesis = Block.genesisBlock;

    it('should return an instance of a Block', () => {
      expect(genesis).toBeInstanceOf(Block);
    });

    it('should return the genesis payload', () => {
      expect(genesis).toEqual(GENESIS_DATA);
    });
  });

  describe('mineBlock() function', () => {
    let lastBlock, payload, minedBlock;

    beforeEach(() => {
      lastBlock = Block.genesisBlock;
      payload = { message: 'Test' };
      minedBlock = Block.mineBlock({ lastBlock, payload });
    });

    it('should return an instance of the Block class', () => {
      expect(minedBlock).toBeInstanceOf(Block);
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
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual('0'.repeat(minedBlock.difficulty));
    });

    it('should produce a hash based on correct input', () => {
      console.log(minedBlock);
      expect(minedBlock.hash).toEqual(
        createHash(
          minedBlock.timestamp,
          minedBlock.lastHash,
          minedBlock.nonce,
          minedBlock.difficulty,
          payload
        )
      );
    });
  });
});
