import express from 'express';
import {
  addBlock,
  getBalance,
  getBlock,
  getLastBlock,
  listBlocks,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.get('/', listBlocks);
router.get('/:index', getBlock);
router.get('/last', getLastBlock);
router.get('/balance/:address', getBalance);
router.post('/mine', addBlock);

export default router;
