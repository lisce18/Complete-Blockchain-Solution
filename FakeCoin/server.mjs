import dotenv from 'dotenv';
import express from 'express';
import { connectMongo } from './config/mongo.mjs';
import PubNubServer from './pubnubServer.mjs';
import morgan from 'morgan';
import Blockchain from './models/Blockchain.mjs';
import TransactionPool from './models/TransactionPool.mjs';
import Wallet from './models/Wallet.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import blockRouter from './routes/block-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import colors from 'colors';

import path from 'path';
import { fileURLToPath } from 'url';
import { initSecurity } from './utilities/initSecurity.mjs';

dotenv.config({ path: './config/config.env' });

connectMongo();

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);
global.__appdir = dirname;

const credentials = {
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  secretKey: process.env.SECRET_KEY,
  userId: process.env.USER_ID,
};

export const blockchain = new Blockchain();
export const transactionPool = new TransactionPool();
export const wallet = new Wallet();
export const pubnubServer = new PubNubServer({
  blockchain,
  transactionPool,
  wallet,
  credentials,
});

const app = express();

app.use(morgan('dev'));

app.use(express.json());

// app.use(express.static(__appdir, 'public'));

initSecurity(app);

const DEFAULT_PORT = 5001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;

setTimeout(() => {
  pubnubServer.broadcast();
}, 1000);

app.use('/api/v1/block', blockRouter);
app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/wallet', transactionRouter);

const synchronize = async () => {
  let response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
  if (response.ok) {
    const result = await response.json();
    console.log('SYNC'.white.underline.bold, result.payload);
    blockchain.replaceChain(result.payload);
  }

  response = await fetch(`${ROOT_NODE}/api/v1/wallet/transactions`);
  if (response.ok) {
    const result = await response.json();
    transactionPool.replaceTransactionMap(result.payload);
  }
};

if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = process.env.PORT || DEFAULT_PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`.yellow.underline.bold);

  if (PORT !== DEFAULT_PORT) {
    synchronize();
  }
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`FEL: ${err.message}`.red);
  server.close(() => process.exit(1));
});
