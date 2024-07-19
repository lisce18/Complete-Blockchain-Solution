import { blockchain, pubnub } from '../server.mjs';
import { MINING_REWARD, REWARD_ADDRESS } from '../config/settings.mjs';

// @desc Add a new block to the chain
// @route POST api/v1/blockchain/mine
// access PRIVATE
export const addBlock = (req, res) => {
  try {
    if (blockchain.pendingTransactions.length === 0) {
      return res.status(400).json({ error: 'There is no transaction to mine' });
    }

    const transactionsToMine = blockchain.pendingTransactions;
    const rewardTransaction = {
      sender: 'REWARD',
      recipient: req.body.rewardAddress || REWARD_ADDRESS,
      amount: MINING_REWARD,
    };

    transactionsToMine.push(rewardTransaction);

    const newBlock = blockchain.addNewBlock(transactionsToMine);

    blockchain.pendingTransactions = [];

    res.status(201).json({ payload: newBlock });

    pubnub.broadcast();
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// @desc List a specific block by index
// @route GET api/v1/blockchain:index
// access PRIVATE
export const getBlock = (req, res) => {
  const { index } = req.params;

  const block = blockchain.chain.find((block) => block.index === +index);

  if (block) {
    res.status(200).json({ payload: block });
  } else {
    res.status(404).json({ error: 'Block not found' });
  }
};

// @desc List the entire chain
// @route GET api/v1/blockchain
// access PRIVATE
export const listBlocks = (req, res) => {
  try {
    res.status(200).json({
      payload: {
        chain: blockchain.chain,
        pendingTransactions: blockchain.pendingTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc Get the balance of an address
// @route GET api/v1/balance/:address
// access PRIVATE
export const getBalance = (req, res) => {
  const { address } = req.params;
  let balance = 0;

  try {
    blockchain.chain.forEach((block) => {
      block.payload.forEach((transaction) => {
        if (transaction.recipient === address) {
          balance += transaction.amount;
        }
        if (transaction.sender === address) {
          balance -= transaction.amount;
        }
      });
    });

    res.status(200).json({ balance });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc List the last block of the chain
// @route GET api/v1/blockchain/last
// access PRIVATE
export const getLastBlock = (req, res) => {
  try {
    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
    res.status(200).json({ payload: lastBlock });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
