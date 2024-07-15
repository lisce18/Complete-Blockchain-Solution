import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  outputMap: {
    type: mongoose.Schema.Types.Mixed,
  },
  inputMap: {
    timestamp: Number,
    amount: Number,
    address: String,
    signature: Object,
  },
});

export default mongoose.model('TransactionModel', transactionSchema);
