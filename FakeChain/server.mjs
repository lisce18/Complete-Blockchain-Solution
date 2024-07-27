import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import Blockchain from './models/Blockchain.mjs';
import PubNubServer from './pubnub-server.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import pubnubRouter from './routes/pubnub-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import userRoutes from './routes/user-routes.mjs';
import { initSecurity } from './utilities/initSecurity.mjs';
import { fileURLToPath } from 'url';
import path from 'path';
import ErrorResponse from './models/ErrorResponseModel.mjs';
import { errorHandler } from './middleware/errorHandler.mjs';

dotenv.config({ path: './config/config.env' });

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);
global._appdir = dirname;

const DEFAULT_PORT = 5001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;

let blockchain;
let pubnub;

const app = express();
app.use(express.json());

initSecurity(app);

app.use(express.static(path.join(_appdir, 'public')));

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/wallet', transactionRouter);
app.use('/api/v1/nodes', pubnubRouter);
app.use('/api/v1/user', userRoutes);

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Route not found - ${req.originalUrl}`, 404));
});

app.use(errorHandler);

if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = NODE_PORT || DEFAULT_PORT;

const synchronize = async () => {
  try {
    const response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);

    if (response.ok) {
      const { payload } = await response.json();
      blockchain.updateChain(payload.chain);
    } else {
      throw new Error('Failed to sync blockchain: Server response not OK');
    }
  } catch (error) {
    console.error(`Failed to sync blockchain: ${error.message}`);
  }
};

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('MongoDB connected...');

    blockchain = new Blockchain();
    pubnub = new PubNubServer({ blockchain, PORT });

    setTimeout(() => {
      pubnub.broadcast();
    }, 1000);
    pubnub.getNodes();

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);

      if (PORT !== DEFAULT_PORT) {
        synchronize();
      }
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectMongo();

export { blockchain, pubnub };
