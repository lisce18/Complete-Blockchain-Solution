import express from 'express';
import { getAllNodes } from '../controllers/pubnub-controller.mjs';
import { protect } from '../middlewear/authorization.mjs';

const router = express.Router();

router.get('/', protect, getAllNodes);

export default router;
