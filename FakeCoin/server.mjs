import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectMongo } from './config/mongo.mjs';
import Blockchain from './models/Blockchain.mjs';
import TransactionPool from './models/TransactionPool.mjs';
import Wallet from './models/Wallet.mjs';
import blockRouter from './routes/block-routes.mjs';
import blockchainRouter from './routes/blockchain-routes.mjs';
import transactionRouter from './routes/transaction-routes.mjs';
import userRouter from './routes/user-routes.mjs';
import PubNubServer from './pubnub-server.mjs';
import { initSecurity } from './utilities/initSecurity.mjs';
import colors from 'colors';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './config/config.env' });

connectMongo();

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);
global._appdir = dirname;

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
  blockchain: blockchain,
  transactionPool: transactionPool,
  wallet: wallet,
  credentials: credentials,
});

const app = express();

initSecurity(app);

app.use(express.json());

app.use(morgan('dev'));

app.use(express.static(path.join(_appdir, 'public')));
const DEFAULT_PORT = process.env.PORT || 5001;
const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

let NODE_PORT;

setTimeout(() => {
  pubnubServer.broadcast();
}, 1000);

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/block', blockRouter);
app.use('/api/v1/wallet', transactionRouter);
app.use('/api/v1/user', userRouter);

const synchronize = async () => {
  let response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);
  if (response.ok) {
    const result = await response.json();
    console.log('SYNC'.white.underline.bold, result.data);
    blockchain.replaceChain(result.data);
  }

  response = await fetch(`${ROOT_NODE}/api/v1/wallet/transactions`);
  if (response.ok) {
    const result = await response.json();
    transactionPool.replaceTransactionMap(result.data);
  }
};

if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1);
}

const PORT = NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`.yellow.underline.bold);

  if (PORT !== DEFAULT_PORT) {
    synchronize();
  }
});
