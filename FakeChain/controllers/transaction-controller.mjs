import Transaction from '../models/Transaction.mjs';
import { blockchain } from '../server.mjs';
import mongoose from 'mongoose';
import { asyncHandler } from '../middleware/asyncHandler.mjs';

const TransactionModel = mongoose.model('Transaction');

// // @desc Make a new transaction
// // @route POST api/v1/wallet/transaction
// // access PRIVATE
export const createTransaction = asyncHandler(async (req, res, next) => {
  const { amount, sender, recipient } = req.body;

  if (!amount || !sender || !recipient) {
    return res
      .status(400)
      .json({ error: 'Transaction details are incomplete' });
  }

  try {
    const newTransaction = new Transaction({ amount, sender, recipient });
    await newTransaction.save();

    blockchain.addNewTransaction(newTransaction);

    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
});

// // @desc List transaction by id
// // @route GET api/v1/wallet/transaction/:transactionId
// // access PRIVATE
export const getTransactionById = asyncHandler(async (req, res, next) => {
  const { transactionId } = req.params;

  try {
    const transaction = await TransactionModel.findOne({
      transactionId,
    }).select('-_id -__v');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    next(error);
  }
});

// // @desc List all transactions made
// // @route GET api/v1/wallet/transactions
// // access PRIVATE
export const getAllTransaction = asyncHandler(async (req, res, next) => {
  try {
    const transactions = await TransactionModel.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    next(error);
  }
});
