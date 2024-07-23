import React from 'react';

export const displayBlockchain = (blockchainList) => {
  return blockchainList.map((block, index) => (
    <div
      key={index}
      className='block'
    >
      <h3>Block {index + 1}</h3>
      <p>Hash: {block.hash}</p>
      <p>Last Hash: {block.lastHash}</p>
      <p>Timestamp: {block.timestamp}</p>
      <ul className='transaction-list'>
        <h3>Transactions</h3>
        {block.payload.map((transaction, i) => (
          <li key={i}>
            <p>Amount: {transaction.amount}</p>
            <p>Recipient: {transaction.recipient}</p>
            <p>Sender: {transaction.sender}</p>
            <p>Transaction Id: {transaction.trxId || transaction._id}</p>
          </li>
        ))}
      </ul>
    </div>
  ));
};
