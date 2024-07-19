import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: Number,
  sender: String,
  recipient: String,
  trxId: String,
});

const blockSchema = new mongoose.Schema({
  index: Number,
  timestamp: Number,
  lastHash: String,
  hash: String,
  payload: [transactionSchema],
  difficulty: Number,
});

const blockchainSchema = new mongoose.Schema({
  chain: [blockSchema],
  pendingTransactions: [transactionSchema],
});

const BlockchainModel = mongoose.model('Blockchain', blockchainSchema);
export default BlockchainModel;
