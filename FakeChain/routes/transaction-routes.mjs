import express from 'express';
import {
  addTransaction,
  getTransactionPool,
  getWalletBalance,
  mineTransactions,
} from '../controllers/transaction-controller.mjs';
import { protect } from '../middlewear/authorization.mjs';

const router = express.Router();

router.get('/info', protect, getWalletBalance);
router.get('/mine', protect, mineTransactions);
router.get('/transactions', getTransactionPool);
router.post('/transaction', protect, addTransaction);

export default router;
