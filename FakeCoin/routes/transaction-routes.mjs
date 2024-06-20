import express from 'express';
import {
  addTransaction,
  getTransactionPool,
  getBalance,
  mineTransactions,
} from '../controllers/transaction-controller.mjs';

const router = express.Router();

router.route('/transaction').post(addTransaction);
router.route('/transactions').get(getTransactionPool);
router.route('/mine').get(mineTransactions);
router.route('/info').get(getBalance);

export default router;
