import { describe, it, expect, beforeEach } from 'vitest';
import Block from '../models/Block.mjs';
import Blockchain from '../models/Blockchain.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';

describe('Blockchain', () => {
  let blockchain, blockchain2, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchain2 = new Blockchain();
    originalChain = blockchain.chain;
  });

  it('should have a property named "chain"', () => {
    expect(blockchain).toHaveProperty('chain');
  });

  it('should have a property "chain" of type Array', () => {
    expect(blockchain.chain).toBeInstanceOf(Array);
  });

  it('should have the genesis block as the first block in the chain', () => {
    expect(blockchain.chain.at(0)).toEqual(Block.genesisBlock);
  });

  it('should add a new block to the chain', () => {
    const payload = 'test-block';
    blockchain.addBlock({ payload });

    expect(blockchain.chain.at(-1).payload).toEqual(payload);
  });

  describe('Validation of chain', () => {
    describe('when the chain does not start with the genesis block', () => {
      it('should return false', () => {
        blockchain.chain[0] = { payload: 'fake-genesis' };

        expect(Blockchain.validateChain(blockchain.chain)).toBe(false);
      });
    });

    describe('when the chain starts with the correct genesis block', () => {
      beforeEach(() => {
        blockchain.addBlock({ payload: 'Test-1' });
        blockchain.addBlock({ payload: 'Test-2' });
        blockchain.addBlock({ payload: 'Test-3' });
      });

      describe('and one of the blocks has an invalid lastHash', () => {
        it('should return false', () => {
          blockchain.chain[1].lastHash = 'fake-lastHash';

          expect(Blockchain.validateChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain contains a block with invalid data', () => {
        it('should return false', () => {
          blockchain.chain[2].payload = 'fake-news';

          expect(Blockchain.validateChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain contains a block with a jumped difficulty level', () => {
        it('should return false', () => {
          const lastBlock = blockchain.chain.at(-1);
          const timestamp = Date.now();
          const lastHash = lastBlock.hash;
          const nonce = 0;
          const payload = [];
          const difficulty = (lastBlock.difficulty || 0) - 4;
          const hash = createHash({
            timestamp,
            lastHash,
            difficulty,
            nonce,
            payload,
          });

          const block = new Block({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            payload,
          });

          blockchain.chain.push(block);

          expect(Blockchain.validateChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain is valid', () => {
        it('should return true', () => {
          expect(Blockchain.validateChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe('replaceChain()', () => {
    describe('when the new chain is shorter', () => {
      it('should not replace the chain', () => {
        blockchain2.chain[0] = { info: 'chain' };
        blockchain.replaceChain(blockchain2.chain);

        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        blockchain2.addBlock({ payload: 'Test-1' });
        blockchain2.addBlock({ payload: 'Test-2' });
        blockchain2.addBlock({ payload: 'Test-3' });
      });

      describe('and the chain is invalid', () => {
        it('should not replce the chain', () => {
          blockchain2.chain[1].hash = 'fake-hash';
          blockchain.replaceChain(blockchain2.chain);

          expect(blockchain.chain).toEqual(originalChain);
        });
      });

      describe('and the chain is valid', () => {
        it('should replace the chain', () => {
          blockchain.replaceChain(blockchain2.chain);

          expect(blockchain.chain).toEqual(blockchain2.chain);
        });
      });
    });
  });
});
