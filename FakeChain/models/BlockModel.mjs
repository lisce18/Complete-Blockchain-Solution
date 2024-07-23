import mongoose from 'mongoose';

const blockSchema = mongoose.Schema({
  timestamp: { type: Date, default: Date.now, required: [true] },
  lastHash: { type: String, required: [true] },
  hash: { type: String, required: [true] },
  transaction: { type: Array, required: [true] },
  nonce: { type: String, required: true },
  difficulty: { type: String, required: true },
});

export { blockSchema };
export default mongoose.model('block', blockSchema);
