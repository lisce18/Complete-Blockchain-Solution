import { describe, it, beforeEach, expect, vi } from 'vitest';
import { blockchain } from '../server.mjs';
import { createHash } from '../utilities/crypto-lib.mjs';
import Block from '../models/Block.mjs';
import Blockchain from '../models/Blockchain.mjs';
import Transaction from '../models/Transaction.mjs';
import Wallet from '../models/Wallet.mjs';

describe('Blockchain', () => {
  let blockchain1, blockchain2, originalChain;

  beforeEach(() => {
    blockchain1 = new Blockchain();
    blockchain2 = new Blockchain();
    originalChain = [...blockchain1.chain];
  });

  describe('Properties', () => {
    it('should have a property named chain', () => {
      expect(blockchain1).toHaveProperty('chain');
    });

    it('should contain an Array', () => {
      expect(blockchain1.chain instanceof Array).toBeTruthy;
    });

    it('should start with the genesis block', () => {
      expect(blockchain1.chain.at(0)).toEqual(Block.createGenesis());
    });
  });

  describe('Methods', () => {
    describe('createNewBlock() function', () => {
      it('should add a new block to the chain', () => {
        const payload = 'Transaction B';
        blockchain1.createNewBlock({ payload });

        expect(blockchain1.chain.at(-1).payload).toEqual(payload);
      });
    });

    describe('chainIsValid() function', () => {
      describe('The genesis block is missing or not the first block in the chain', () => {
        it('should return false', () => {
          blockchain1.chain[0] = { payload: 'CORRUPT' };

          expect(Blockchain.chainIsValid(blockchain1.chain)).toBe(false);
        });
      });

      describe('When the chain starts with the genesis block and consists of multiple blocks', () => {
        beforeEach(() => {
          blockchain1.createNewBlock({ payload: 'Transaction C' });
          blockchain1.createNewBlock({ payload: 'Transaction D' });
          blockchain1.createNewBlock({ payload: 'Transaction E' });
          blockchain1.createNewBlock({ payload: 'Transaction F' });
          blockchain1.createNewBlock({ payload: 'Transaction G' });
        });
        describe('and the lastHash has changed', () => {
          it('should return false', () => {
            blockchain1.chain[1].lastHash = 'CORRUPT';

            expect(Blockchain.chainIsValid(blockchain1.chain)).toBe(false);
          });
        });

        describe('and the chain contains a block with invalid information/payload', () => {
          it('should return false', () => {
            blockchain1.chain[2].payload = 'CORRUPT';

            expect(Blockchain.chainIsValid(blockchain1.chain)).toBe(false);
          });
        });

        describe('and the chain contains a block with a jumped difficulty jump', () => {
          it('should return false', () => {
            const lastBlock = blockchain1.chain.at(-1);
            const lastHash = lastBlock.hash;
            const timestamp = Date.now();
            const nonce = 0;
            const payload = [];
            const difficulty = lastBlock.difficulty - 4;
            const stringToHash = timestamp
              .toString()
              .concat(lastHash, JSON.stringify(payload), nonce, difficulty);
            const hash = createHash(stringToHash);
            const block = new Block({
              timestamp,
              lastHash,
              hash,
              payload,
              nonce,
              difficulty,
            });
            blockchain1.chain.push(block);

            expect(Blockchain.chainIsValid(blockchain1.chain)).toBe(false);
          });
        });

        describe('and the chain is valid', () => {
          it('should return true', () => {
            expect(Blockchain.chainIsValid(blockchain1.chain)).toBe(true);
          });
        });
      });
    });

    describe('replaceChain() function', () => {
      describe('when the new chain is smaller or the same size', () => {
        it('should not replace the chain', () => {
          blockchain1.replaceChain(blockchain2.chain);
          expect(blockchain1.chain).toEqual(originalChain);
        });
      });

      describe('when the new chain is larger', () => {
        beforeEach(() => {
          blockchain2.createNewBlock({ payload: 'Transaction 1' });
          blockchain2.createNewBlock({ payload: 'Transaction 2' });
          blockchain2.createNewBlock({ payload: 'Transaction 3' });
          blockchain2.createNewBlock({ payload: 'Transaction 4' });
          blockchain2.createNewBlock({ payload: 'Transaction 5' });
          blockchain2.createNewBlock({ payload: 'Transaction 6' });
          blockchain2.createNewBlock({ payload: 'Transaction 7' });
        });

        describe('but is invalid', () => {
          it('should not replace the chain', () => {
            blockchain2.chain[2].hash = 'CORRUPT';
            blockchain1.replaceChain(blockchain2.chain);
            expect(blockchain1.chain).toEqual(originalChain);
          });
        });

        describe('and when it is valid', () => {
          it('should replace the chain', () => {
            blockchain1.replaceChain(blockchain2.chain);
            expect(blockchain1.chain).toBe(blockchain2.chain);
          });
        });
      });

      describe('and the shouldValidate flag is true', () => {
        it('should call validateTransactionData()', () => {
          const validateTransactionPayloadMockFn = vi.fn();

          blockchain1.validateTransactionPayload =
            validateTransactionPayloadMockFn;

          blockchain2.createNewBlock({ payload: 'TEST' });
          blockchain1.replaceChain(blockchain2.chain, true);

          expect(validateTransactionPayloadMockFn).toHaveBeenCalled();
        });
      });
    });

    describe('Validate Transaction payload', () => {
      let transaction, transactionReward, wallet;

      beforeEach(() => {
        wallet = new Wallet();

        transaction = wallet.createTransaction({
          recipient: 'Sara',
          amount: 25,
        });
        transactionReward = Transaction.transactionReward({ miner: wallet });
      });

      describe('and the transaction payload is valid', () => {
        it('should return true', () => {
          blockchain2.createNewBlock({
            payload: [transaction, transactionReward],
          });

          expect(
            blockchain1.validateTransactionPayload({ chain: blockchain2.chain })
          ).toBe(true);
        });
      });

      describe('and there are multiple rewards', () => {
        it('should return false', () => {
          blockchain2.createNewBlock({
            payload: [transaction, transactionReward, transactionReward],
          });

          expect(
            blockchain1.validateTransactionPayload({ chain: blockchain2.chain })
          ).toBe(false);
        });
      });

      describe('and the transaction payload consists of at least one incorrectly formatted output', () => {
        it('should return false', () => {
          transaction.outputMap[wallet.publicKey] = 999999;

          blockchain2.createNewBlock({
            payload: [transaction, transactionReward],
          });

          expect(
            blockchain1.validateTransactionPayload({ chain: blockchain2.chain })
          ).toBe(false);
        });
      });

      describe('and the block contains identical transactions', () => {
        it('should return false', () => {
          blockchain2.createNewBlock({
            payload: [
              transaction,
              transaction,
              transaction,
              transaction,
              transactionReward,
            ],
          });

          expect(
            blockchain1.validateTransactionPayload({ chain: blockchain2.chain })
          ).toBe(false);
        });
      });
    });
  });
});
