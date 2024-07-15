import React, { useEffect, useState } from 'react';
import { calculateBalance, sendTransaction } from '../services/wallet';
import { formatTimestamp, getToken, shortenKey } from '../services/misc';
import { Popup } from '../Components/Popup';
import { IconSquareChevronRight } from '@tabler/icons-react';

export const Transaction = () => {
  const [tx, setTx] = useState({ recipient: '', amount: '' });
  const [txInput, setTxInput] = useState('');
  const [txReceipt, setTxReceipt] = useState('');
  const [displayPopup, setDisplayPopup] = useState('');
  const [senderAddress, setSenderAddress] = useState(null);
  const [senderBalance, setSenderBalance] = useState(null);

  useEffect(() => {
    const getInfo = async () => {
      const token = localStorage.getItem('loginInfo');

      if (token && token !== 'undefined') {
        try {
          const response = await calculateBalance();
          if (response.statusCode === 200) {
            setSenderAddress(response.payload.address);
            setSenderBalance(response.payload.balance);
          }
        } catch (error) {
          return setDisplayPopup({ title: 'Error', text: 'Server error' });
        }
      }
    };
    getInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTx((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token || token === 'undefined') {
      return setDisplayPopup({
        title: 'Error',
        text: 'You need to be logged in to proceed.',
      });
    }

    if (tx.recipient === (undefined || '') || tx.amount === (undefined || '')) {
      return setDisplayPopup({
        title: 'Error',
        text: 'Input field(s) can not be empty.',
      });
    }

    const response = await sendTransaction(tx, token);

    if (response.statusCode === 201) {
      setTxReceipt(response.payload);
      setTxInput(tx);
      setTx({ recipient: '', amount: '' });
    } else {
      return setDisplayPopup({ title: 'Error', text: response.error });
    }
  };

  const formatOutputMap = (payload) => {
    if (txReceipt) {
      const senderAddress = txReceipt.inputMap.address;
      const senderBalance = payload[senderAddress];
      return (
        <>
          <div>Recipient: {txInput.recipient}</div>
          <div>Amount to be recieved: {txInput.amount}</div>
          <div>Sender: {shortenKey(txReceipt.inputMap.address)}</div>
          <div>Sender remaining balance: {senderBalance}</div>
        </>
      );
    }
  };

  return (
    <>
      <main className='transact-wrapper'>
        <h2>Transaction input</h2>
        <div className='sender-wrapper'>
          {!senderAddress && !senderBalance ? (
            <div className='sender-row'>
              Log in and refresh to see your address and balance.
            </div>
          ) : (
            <>
              <div className='sender-row'>
                Sender: {shortenKey(senderAddress)}
              </div>
              <div className='sender-row'>
                Starting balance: {senderBalance}
              </div>
            </>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='tx-recipient'>Recipient: </label>
            <input
              type='text'
              id='tx-recipient'
              name='recipient'
              value={tx?.recipient || ''}
              onChange={handleChange}
              autoComplete='off'
            ></input>
          </div>
          <div className='form-control'>
            <label htmlFor='tx-amount'>Amount: </label>
            <input
              id='tx-amount'
              name='amount'
              type='number'
              value={tx?.amount || ''}
              onChange={handleChange}
              autoComplete='off'
            ></input>
          </div>
          <div
            className='button-control'
            onClick={handleSubmit}
          >
            <button>Send</button>
          </div>
        </form>
        <section className='receipt-wrapper'>
          {txReceipt && (
            <>
              <h2>Transaction receipt</h2>
              <div className='receipt'>
                <h3>
                  {' '}
                  <IconSquareChevronRight /> Transaction added to queue:
                </h3>
                <div className='receipt-multi'>
                  {formatOutputMap(txReceipt.outputMap)}
                </div>
                <br />
                <div className='receipt-single'>
                  Transaction id: {txReceipt.id}
                </div>
                <div className='receipt-single'>
                  Time and date: {formatTimestamp(txReceipt.inputMap.timestamp)}
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      {displayPopup !== '' && (
        <Popup
          setDisplayPopup={setDisplayPopup}
          displayPopup={displayPopup}
        />
      )}
    </>
  );
};
