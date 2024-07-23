import PubNub from 'pubnub';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  NODES: 'NODES',
};

const credentials = {
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  secretKey: process.env.SECRET_KEY,
  userId: 'fake-chain',
};

class PubNubServer {
  constructor({ blockchain, PORT }) {
    this.blockchain = blockchain;
    this.PORT = PORT;
    this.pubnub = new PubNub(credentials);
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    this.pubnub.addListener(this.listener());
    this.nodes = [];

    setTimeout(() => {
      this.broadcastNodes();
      this.broadcast();
    }, 1000);
  }

  addNode(node) {
    const exists = this.nodes.find((n) => n.address === node.address);
    if (!exists) {
      this.nodes.push(node);
      console.log(`Added new node: ${node.address}`);
    } else {
      console.log(`Node ${node.address} already exists`);
    }
  }

  broadcastNodes() {
    const portMessage = { address: this.PORT };
    this.pubnub
      .publish({
        channel: CHANNELS.NODES,
        message: JSON.stringify(portMessage),
      })
      .then(() => console.log('Successfully broadcasted node:', portMessage))
      .catch((err) => console.error(`Failed to publish data, error: ${err}`));
  }
  broadcast() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  getNodes() {
    return this.nodes;
  }

  broadcast() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  listener() {
    return {
      message: (msgObject) => {
        const { channel, message } = msgObject;
        const msg = JSON.parse(message);

        console.log(
          `Message recieved on channel: ${channel}, message: ${message}`
        );

        switch (channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(msg, () => {
              this.transactionPool.clearBlockTransactions({ chain: msg });
            });
            break;
          case CHANNELS.TRANSACTION:
            if (
              !this.transactionPool.transactionExist({
                address: this.wallet.publicKey,
              })
            ) {
              this.transactionPool.addTransaction(msg);
            }
            break;
          case CHANNELS.NODES:
            this.addNode(msg);
            break;
          default:
            return;
        }
      },
    };
  }

  handleMsg(msgObj) {
    const { channel, message } = msgObj;
    const parsedMessage = JSON.parse(message);

    console.log(`Received message on channel ${channel}:`, parsedMessage);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.updateChain(parsedMessage);
      console.log('Blockchain updated with received data');
    } else if (channel === CHANNELS.NODES) {
      this.addNode(parsedMessage);
    }
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
}

export default PubNubServer;
