import express from 'express';
import {
  createTrx,
  getAllTrx,
  getTrxById,
} from '../controllers/transaction-controller.mjs';
import { protect } from '../middlewear/authorization.mjs';

const router = express.Router();

router.get('/', protect, getAllTrx);
router.get('/:trxId', protect, getTrxById);
router.post('/transaction', protect, createTrx);

export default router;
