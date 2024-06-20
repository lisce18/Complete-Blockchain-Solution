import {
  blockchain,
  pubnubServer,
  transactionPool,
  wallet,
} from '../server.mjs';
import Miner from '../models/Miner.mjs';
import Wallet from '../models/Wallet.mjs';

export const addTransaction = (req, res, next) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.transactionExist({
    address: wallet.publicKey,
  });

  try {
    if (transaction) {
      transaction.update({ sender: wallet, recipient: amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, statusCode: 400, error: error.message });
  }

  transactionPool.addTransaction(transaction);
  pubnubServer.broadcastTransaction(transaction);

  res
    .status(201)
    .json({ success: true, statusCode: 201, payload: transaction });
};

export const getBalance = (req, res, next) => {
  const address = wallet.publicKey;
  const balance = Wallet.calculateBalance({ chain: blockchain, address });

  res
    .status(200)
    .json({ success: true, statuscode: 200, payload: { address, balance } });
};

export const getTransactionPool = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    paload: transactionPool.transactionMap,
  });
};

export const mineTransactions = (req, res, next) => {
  const miner = new Miner({
    blockchain,
    transactionPool,
    wallet,
    pubsub: pubnubServer,
  });

  miner.mineTransactions();

  res.status(200).json({ success: true, statusCode: 200, payload: 'Success' });
};
