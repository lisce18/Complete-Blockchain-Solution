import express from 'express';
import { addNewBlock } from '../controllers/block-controller.mjs';

const router = express.Router();

router.route('/mine').post(addNewBlock);
export default router;
