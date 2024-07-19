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

if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || NODE_PORT || DEFAULT_PORT;

const synchronize = async () => {
  try {
    const response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);

    if (response.ok) {
      const { payload } = await response.json();
      blockchain.updateChain(payload.chain); // Ensure to update with chain payload
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

    // Initialize blockchain and pubnub after successful DB connection
    blockchain = new Blockchain();
    pubnub = new PubNubServer({ blockchain, PORT });

    // Broadcast the initial state of the blockchain
    setTimeout(() => {
      pubnub.broadcast();
    }, 1000);
    pubnub.getNodes();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);

      if (PORT !== DEFAULT_PORT) {
        synchronize();
      }
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

connectMongo();

export { blockchain, pubnub };

// import express from 'express';
// import dotenv from 'dotenv';
// import morgan from 'morgan';
// import { connectMongo } from './config/mongo.mjs';
// import Blockchain from './models/Blockchain.mjs';
// import TransactionPool from './models/TransactionPool.mjs';
// import Wallet from './models/Wallet.mjs';
// import blockRouter from './routes/block-routes.mjs';
// import blockchainRouter from './routes/blockchain-routes.mjs';
// import transactionRouter from './routes/transaction-routes.mjs';
// import userRouter from './routes/user-routes.mjs';
// import PubNubServer from './pubnub-server.mjs';
// import { initSecurity } from './utilities/initSecurity.mjs';
// import colors from 'colors';

// import path from 'path';
// import { fileURLToPath } from 'url';

// dotenv.config({ path: './config/config.env' });

// connectMongo();

// const fileName = fileURLToPath(import.meta.url);
// const dirname = path.dirname(fileName);
// global._appdir = dirname;

// const credentials = {
//   publishKey: process.env.PUBLISH_KEY,
//   subscribeKey: process.env.SUBSCRIBE_KEY,
//   secretKey: process.env.SECRET_KEY,
//   userId: process.env.USER_ID,
// };

// export const blockchain = new Blockchain();
// export const transactionPool = new TransactionPool();
// export const wallet = new Wallet();
// export const pubnubServer = new PubNubServer({
//   blockchain: blockchain,
//   transactionPool: transactionPool,
//   wallet: wallet,
//   credentials: credentials,
// });

// const app = express();

// initSecurity(app);

// app.use(express.json());

// app.use(morgan('dev'));

// app.use(express.static(path.join(_appdir, 'public')));

// const DEFAULT_PORT = process.env.PORT || 5001;
// const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

// let NODE_PORT;

// setTimeout(() => {
//   pubnubServer.broadcast();
// }, 1000);

// app.use('/api/v1/blockchain', blockchainRouter);
// app.use('/api/v1/block', blockRouter);
// app.use('/api/v1/wallet', transactionRouter);
// app.use('/api/v1/user', userRouter);

// const synchronize = async () => {
//   try {
//     const response = await fetch(`${ROOT_NODE}/api/v1/blockchain`);

//     if (response.ok) {
//       const { payload } = await response.json();
//       blockchain.updateChain(payload.chain);
//     } else {
//       throw new Error('Failed to sync blockchain: Server response not OK');
//     }
//   } catch (error) {
//     console.error(`Failed to sync blockchain: ${error.message}`);
//   }
// };

// if (process.env.GENERATE_NODE_PORT === 'true') {
//   NODE_PORT = DEFAULT_PORT + Math.floor(Math.random() * 1000);
// }

// const PORT = NODE_PORT || DEFAULT_PORT;

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`.yellow.underline.bold);

//   if (PORT !== DEFAULT_PORT) {
//     synchronize();
//   }
// });
