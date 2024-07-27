import React from 'react';

export const displayBlockchain = (blockchainList) => {
  return blockchainList.map((block, index) => (
    <div
      key={index}
      className='block'
    >
      <div className='block-container'>
        <h3 className='block-title'>Block {index + 1}</h3>
        <p className='hash'>Hash: {block.hash}</p>
        <p className='lastHash'>Last Hash: {block.lastHash}</p>
        <p>Timestamp: {block.timestamp}</p>
        <ul className='transaction-list'>
          <h3>Transactions</h3>
          {block.payload.map((transaction, i) => (
            <li key={i}>
              <p>Amount: {transaction.amount}</p>
              <p>Recipient: {transaction.recipient}</p>
              <p>Sender: {transaction.sender}</p>
              <p>
                Transaction Id: {transaction.transactionId || transaction._id}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  ));
};
