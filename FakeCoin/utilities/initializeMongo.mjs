import { MongoClient } from 'mongodb';

export const initializeMongo = async (client) => {
  this.client = new MongoClient(process.env.MONGO_URI);
  try {
    await this.client.connect();
    this.db = this.client.db('test');
    await this.loadBlockchain();
  } catch (error) {
    console.error(error);
  }
};
