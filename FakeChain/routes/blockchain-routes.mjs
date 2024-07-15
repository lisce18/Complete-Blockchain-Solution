import express from 'express';
import { listChain } from '../controllers/blockchain-controller.mjs';
import { protect } from '../middlewear/authorization.mjs';

const router = express.Router();

router.get('/', protect, listChain);

export default router;
