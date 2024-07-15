import {
  blockchain,
  pubnubServer,
  transactionPool,
  wallet,
} from '../server.mjs';
import Miner from '../models/Miner.mjs';
// import TransactionModel from '../models/TransactionModel.mjs';
import Wallet from '../models/Wallet.mjs';

// @desc Make a transaction
// @route POST api/v1/wallet/transaction
// access PRIVATE
export const addTransaction = (req, res, next) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.transactionExist({
    address: wallet.publicKey,
  });

  if (transaction) {
    transaction.update({ sender: wallet, recipient, amount });
  } else {
    transaction = wallet.createTransaction({
      recipient,
      amount,
      chain: blockchain.chain,
    });
  }

  transactionPool.addTransaction(transaction);
  pubnubServer.broadcastTransaction(transaction);

  res
    .status(201)
    .json({ success: true, statusCode: 201, payload: transaction });
};

// @desc List the pending transactions yet to be added to a block
// @route POST api/v1/wallet/transactions
// access PRIVATE
export const getTransactionPool = (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    payload: transactionPool.transactionMap,
  });
};

// @desc See the current wallets information
// @route GET api/v1/wallet/info
// access PRIVATE
export const getWalletBalance = (req, res, next) => {
  const address = wallet.publicKey;
  const balance = Wallet.calculateBalance({
    chain: blockchain.chain,
    address,
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    payload: { address, balance },
  });
};

// @desc Mine transactions
// @route GET api/v1/wallet/mine
// access PRIVATE
export const mineTransactions = (req, res, next) => {
  const miner = new Miner({
    blockchain,
    transactionPool,
    wallet,
    pubsub: pubnubServer,
  });

  const minedTransaction = miner.mineTransaction();

  res.status(200).json({
    success: true,
    statusCode: 200,
    payload: minedTransaction,
  });
};
