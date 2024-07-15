import mongoose from 'mongoose';
import BlockModel, { blockSchema } from './BlockModel.mjs';
import { GENESIS_DATA } from '../config/settings.mjs';
import { closeMongoDBConnection, connectMongo } from '../config/mongo.mjs';
import PubNubServer from '../pubnub-server.mjs';

const blockchainSchema = new mongoose.Schema({
  chain: [blockSchema],
});

blockchainSchema.statics.findLastBlock = async function () {};

blockchainSchema.statics.initializeBlockchain = async function () {
  const existingBlocksCount = await BlockModel.countDocuments();

  if (existingBlocksCount === 0) {
    const genesisBlock = GENESIS_DATA;
    const genesisBlockDocument = new this({
      chain: [genesisBlock],
    });
    await genesisBlockDocument.save();
    await BlockModel.create(genesisBlock);
    closeMongoDBConnection();

    console.log('Genesis block added to the blockchain');
    connectMongo();
  }
};

export default mongoose.model('BlockchainModel', blockchainSchema);
