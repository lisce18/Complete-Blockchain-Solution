import BlockModel from '../models/BlockModel.mjs';
import { blockchain, pubnubServer } from '../server.mjs';

export const addNewBlock = async (req, res, next) => {
  const payload = req.body;

  const block = blockchain.createNewBlock({ payload });

  pubnubServer.broadcast();

  const { hash, lastHash, nonce, difficulty } = block;
  const timestamp = Date.now(block.timestamp);
  const tx = Object.entries(block.payload);

  await BlockModel.create({
    timestamp,
    lastHash,
    hash,
    tx,
    nonce,
    difficulty,
  });

  res.status(201).json({ success: true, statusCode: 201, payload: block });
};
