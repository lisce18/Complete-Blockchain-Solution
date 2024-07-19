export const INITIAL_BALANCE = 1000;
export const REWARD_ADDRESS = { address: 'reward-address' };
export const MINING_REWARD = 25;
export const GENESIS_BLOCK = {
  timestamp: 1,
  lastHash: '0',
  hash: '0',
  index: 0,
  payload: [
    {
      amount: 0,
      recipient: 'Genesis Block',
      sender: 'Genesis Block',
    },
  ],
};
