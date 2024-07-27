import React from 'react';

export const displayPending = (pendingTransactions) => {
  return pendingTransactions.map((transaction, i) => (
    <li
      key={i}
      className='pending-trx'
    >
      <p>Amount: {transaction.amount}</p>
      <p>Recipient: {transaction.recipient}</p>
      <p>Sender: {transaction.sender}</p>
      <p>Transaction Id: {transaction.transactionId}</p>
    </li>
  ));
};

const ListDisplay = () => {
  return <div>TransactionList</div>;
};

export default ListDisplay;
