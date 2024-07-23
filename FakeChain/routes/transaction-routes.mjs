import express from 'express';
import {
  createTransaction,
  getAllTransaction,
  getTransactionById,
} from '../controllers/transaction-controller.mjs';

const router = express.Router();

router.get('/', getAllTransaction);
router.get('/:transactionId', getTransactionById);
router.post('/transaction', createTransaction);

export default router;
