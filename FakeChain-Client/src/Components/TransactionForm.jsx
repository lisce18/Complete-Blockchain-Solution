import React, { useState } from 'react';
import { makeTransaction } from '../services/fetchBlockchain';

const TransactionForm = ({ getBlockchain, availablePort }) => {
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
      const result = await makeTransaction(transaction, availablePort);
      setTransactionDetails(result);
      getBlockchain(availablePort);
      window.alert('Transaction added successfully');
      window.location.reload();
    } catch (err) {
      console.error(`Error adding transaction: ${err}`);
    }
  };

  return (
    <div className='make-trx-container'>
      <h3 className='make-trx-title'>Make a transaction</h3>
      <form
        className='trx-form'
        onSubmit={handleMakeTransaction}
      >
        <div className='form-control'>
          <label className='input-title'>Sender:</label>
          <input
            type='text'
            value={sender}
            placeholder='Name...'
            onChange={(e) => setSender(e.target.value)}
            required
          />
        </div>
        <div className='form-control'>
          <label className='input-title'>Recipient:</label>
          <input
            type='text'
            value={recipient}
            placeholder='Name...'
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <div className='form-control'>
          <label className='input-title'>Amount:</label>
          <input
            type='text'
            value={amount}
            placeholder='Amount...'
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button
          className='send-btn'
          type='submit'
        >
          Send Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
