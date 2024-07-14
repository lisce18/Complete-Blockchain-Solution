import { blockchain } from '../server.mjs';

// @desc List the chain
// @route GET api/v1/blockchain
// access PRIVATE
export const listChain = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, statusCode: 200, payload: blockchain.chain });
};
