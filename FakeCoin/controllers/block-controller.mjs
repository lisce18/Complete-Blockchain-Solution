import { pubnubServer } from '../server.mjs';
import { blockchain } from '../server.mjs';

export const mineBlock = (req, res, next) => {
  const payload = req.body;

  const block = blockchain.addBlock({ payload });

  pubnubServer.broadcast();

  res.status(201).json({ success: true, statusCode: 201, payload: block });
};
