import Transaction from './Transaction.mjs';

export default class Miner {
  constructor({ blockchain, pubsub, transactionPool, wallet }) {
    this.blockchain = blockchain;
    this.pubsub = pubsub;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
  }

  mineTransactions() {
    const validTransactions = this.transactionPool.validateTransactions();
    validTransactions.push(
      Transaction.transactionReward({ miner: this.wallet })
    );

    this.blockchain.addBlock({ payload: validTransactions });

    this.pubsub.broadcast();

    this.transactionPool.clearTransactions();
  }
}
