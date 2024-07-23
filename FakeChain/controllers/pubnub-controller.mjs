import { pubnub } from '../server.mjs';

// @description Get all nodes
// @route GET /api/v1/nodes/
// @access Private
export const getAllNodes = (req, res) => {
  const nodes = pubnub.getNodes();

  res.status(200).json({ nodes });
};
