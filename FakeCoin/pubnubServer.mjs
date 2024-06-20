import PubNub from 'pubnub';

const CHANNELS = { DEMO: 'DEMO', BLOCKCHAIN: 'BLOCKCHAIN' };

// const { PUBLISH_KEY, SUBSCRIBE_KEY, SECRET_KEY, USER_ID } = process.env;
// const credentials = {
//   publishKey: process.env.PUBLISH_KEY,
//   subscribeKey: process.env.SUBSCRIBE_KEY,
//   secretKey: process.env.SECRET_KEY,
//   userId: process.env.USER_ID,
// };

export default class PubNubServer {
  constructor({ blockchain, credentials }) {
    this.blockchain = blockchain;

    this.pubnub = new PubNub(credentials);
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    this.pubnub.addListener(this.listener());
  }

  broadcast({
    channel = CHANNELS.BLOCKCHAIN,
    message = JSON.stringify(this.blockchain.chain),
  } = {}) {
    this.publish({ channel, message });
  }

  listener() {
    return {
      message: (msgObject) => {
        const { channel, message } = msgObject;
        const msg = JSON.parse(message);

        console.log(
          `Meddelandet togs emot på kanal: ${channel}, meddelandet: ${message}`
            .blue.underline.bold
        );

        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(msg);
        }
      },
    };
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
}
