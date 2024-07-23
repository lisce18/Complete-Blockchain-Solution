import React, { useState } from 'react';
import { makeTransaction } from '../services/fetchBlockchain';

const TransactionForm = ({ getBlockchain, dynamicPort }) => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);

  const handleMakeTransaction = async (e) => {
    e.preventDefault();
    const transaction = {
      sender,
      recipient,
      amount: +amount,
    };
    try {
      const result = await makeTransaction(transaction, dynamicPort);
      setTransactionDetails(result);
      getBlockchain(dynamicPort);
    } catch (err) {
      console.error(`Error adding transaction: ${err}`);
    }
  };

  return (
    <div className='form-wrapper'>
      <h3>Add a transaction</h3>
      <form
        className='trx-form'
        onSubmit={handleMakeTransaction}
      >
        <label>
          Sender:
          <input
            type='text'
            value={sender}
            placeholder='Type name here...'
            onChange={(e) => setSender(e.target.value)}
            required
          />
        </label>
        <label>
          Recipient:
          <input
            type='text'
            value={recipient}
            placeholder='Type name here...'
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </label>
        <label>
          Amount:
          <input
            type='text'
            value={amount}
            placeholder='Type amount here...'
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <button type='submit'>Make Transaction</button>
      </form>
      {/* {transactionDetails && (
        <div className="transaction-details">
          <h3>Transaction Details</h3>
          <p>Transaction Id: {transactionDetails.txId}</p>
          <p>Sender: {transactionDetails.sender}</p>
          <p>Recipient: {transactionDetails.recipient}</p>
          <p>Amount: {transactionDetails.amount}</p>
        </div>
      )} */}
    </div>
  );
};

export default TransactionForm;
