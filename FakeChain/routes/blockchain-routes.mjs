import express from 'express';
import {
  addBlock,
  getBalance,
  getBlock,
  getLastBlock,
  listBlocks,
} from '../controllers/blockchain-controller.mjs';
import { protect } from '../middlewear/authorization.mjs';

const router = express.Router();

router.get('/', protect, listBlocks);
router.get('/:index', protect, getBlock);
router.get('/last', protect, getLastBlock);
router.get('/balance/:address', protect, getBalance);
router.post('/mine', protect, addBlock);

export default router;
