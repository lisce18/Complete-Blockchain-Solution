import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
});

export const TransactionModel = mongoose.model(
  'Transaction',
  transactionSchema
);

export default class Transaction {
  constructor(details) {
    if (!details.amount || !details.sender || !details.recipient) {
      throw new Error('Transaction details are incomplete');
    }

    this.amount = details.amount;
    this.sender = details.sender;
    this.recipient = details.recipient;
    this.transactionId = this.generateTransactionId();
  }

  generateTransactionId() {
    return uuid().replaceAll('-', '');
  }

  async save() {
    const transaction = new TransactionModel({
      amount: this.amount,
      sender: this.sender,
      recipient: this.recipient,
      transactionId: this.transactionId,
    });

    try {
      await transaction.save();
      console.log('Transaction saved to MongoDB');
    } catch (error) {
      console.error('Error saving transaction to MongoDB:', error);
    }
  }
}
