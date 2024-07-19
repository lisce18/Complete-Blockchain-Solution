import Transaction from '../models/Transaction.mjs';
import BlockchainModel from '../models/BlockchainModel.mjs';
import { blockchain } from '../server.mjs';
import mongoose from 'mongoose';

const TransactionModel = mongoose.model('Transaction');

// // @desc Make a new transaction
// // @route POST api/v1/wallet/transaction
// // access PRIVATE
export const createTrx = async (req, res, next) => {
  const { amount, sender, recipient } = req.body;

  if (!amount || !sender || !recipient) {
    return res
      .status(400)
      .json({ error: 'Transaction details are incomplete' });
  }

  try {
    const newTrx = new Transaction({ amount, sender, recipient });
    await newTrx.save();

    // await addTransactionToPending(newTrx);

    blockchain.addNewTrx(newTrx);

    res.status(201).json(newTrx);
  } catch (error) {
    next(error);
  }
};

// // @desc List transaction by id
// // @route GET api/v1/wallet/transaction/:trxId
// // access PRIVATE
export const getTrxById = async (req, res, next) => {
  const { trxId } = req.params;

  try {
    const transaction = await TransactionModel.findOne({ trxId });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    next(error);
  }
};

// // @desc List all transactions made
// // @route GET api/v1/wallet/transactions
// // access PRIVATE
export const getAllTrx = async (req, res, next) => {
  try {
    const transactions = await TransactionModel.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    next(error);
  }
};
