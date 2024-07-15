import React, { useEffect, useState } from 'react';
import { listTransactions, mine } from '../services/wallet.js';
import { formatTimestamp, getToken, shortenKey } from '../services/misc.js';
import {
  IconBox,
  IconPick,
  IconRotateDot,
  IconSquareChevronsRight,
} from '@tabler/icons-react';
import { Popup } from '../Components/Popup';

export const Mine = () => {
  const [newBlock, setNewBlock] = useState(null);
  const [pendingTx, setpendingTx] = useState(null);
  const [displayPopup, setDisplayPopup] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const showTransactions = async () => {
      try {
        const response = await listTransactions();
        if (response.statusCode === 200) {
          setpendingTx(Object.values(response.payload)[0]);
        } else {
          return setDisplayPopup({ title: 'Error', text: response.error });
        }
      } catch (error) {
        return setDisplayPopup({ title: 'Error', text: 'Server error' });
      }
    };

    showTransactions();
  }, [newBlock]);

  const handleClick = async () => {
    const token = getToken();
    if (!token || token === 'undefined') {
      return setDisplayPopup({
        title: 'Error',
        text: 'You need to be logged in to proceed.',
      });
    }

    try {
      setLoading(true);
      const response = await mine(token);

      if (response.statusCode === 200) {
        setTimeout(() => {
          setLoading(false);
          setNewBlock(response.payload);
        }, 3000);
      } else {
        return setDisplayPopup({ title: 'Error', text: response.error });
      }
    } catch (error) {
      return setDisplayPopup({ title: 'Error', text: 'Server error' });
    }
  };

  const formatPending = (payload) => {
    if (payload) {
      const senderAddress = pendingTx.inputMap.address;
      const senderValue = payload[senderAddress];
      const formattedData = Object.entries(payload);
      const filteredData = formattedData.filter(
        (sender) => sender[0] !== senderAddress
      );

      return (
        <>
          <div>
            <div>
              Sender: {shortenKey(senderAddress)}, Remaining balance:{' '}
              {senderValue}
            </div>
          </div>
          {filteredData.map(([key, value], index) => (
            <div key={index}>
              <div>
                Recipient: {key}, Amount: {value}
              </div>
            </div>
          ))}
        </>
      );
    }
  };

  const formatLatest = (payload) => {
    return payload.map((tx, txIndex) => (
      <React.Fragment key={txIndex}>
        <>
          <div className='latest-value'>Batch {txIndex === 0 ? 'A' : 'B'}:</div>
        </>
        <div className='latest-value'>
          Sender: {shortenKey(tx.inputMap.address)}
        </div>

        <>
          {Object.entries(tx.outputMap).map(([address, value], index) => {
            const senderAddress = tx.inputMap.address;
            if (address !== senderAddress) {
              return (
                <div
                  className='latest-value'
                  key={index}
                >
                  <div>
                    Recipient: {shortenKey(address)}, Amount: {value}
                  </div>
                </div>
              );
            }
          })}
        </>
        <br />
      </React.Fragment>
    ));
  };

  return (
    <>
      <main className='mine-wrapper'>
        <section className='mine-button'>
          <div className='button-control'>
            <button onClick={handleClick}>
              <span>Mine</span>
              <IconPick />
            </button>
          </div>
        </section>

        <section className='pending-transactions'>
          {pendingTx && (
            <>
              <h2>Pending transactions</h2>
              <div className='pending'>
                <h3>
                  {' '}
                  <IconRotateDot /> Transaction pool:
                </h3>
                <div className='pending-multi'>
                  {formatPending(pendingTx.outputMap)}
                </div>
                <br />
                <div className='pending-single'>
                  Transaction id: {pendingTx.id}
                </div>
                <div className='pending-single'>
                  Timestamp: {formatTimestamp(pendingTx.inputMap.timestamp)}
                </div>
              </div>
            </>
          )}
        </section>

        {loading && (
          <div className='loading-wrapper'>
            <div className='loading'></div>
            <h3>Mining...</h3>
          </div>
        )}

        <section className='latest-block-wrapper'>
          {newBlock && !loading && (
            <>
              <h2>Mined block</h2>
              <div className='latest-block'>
                <h3>
                  {' '}
                  <IconBox /> Block payload:
                </h3>
                <div className='latest-single'>Hash: {newBlock.hash}</div>
                <div className='latest-single'>
                  Difficulty: {newBlock.difficulty}
                </div>
                <div className='latest-single'>Nonce: {newBlock.nonce}</div>
                <div className='latest-single'>
                  Time: {formatTimestamp(newBlock.timestamp)}
                </div>
                <div className='latest-single'>
                  Last hash: {newBlock.lastHash}
                </div>
                <h3>
                  {' '}
                  <IconSquareChevronsRight />
                  Transactions included in this block:
                </h3>
                <div className='latest-multi'>
                  {formatLatest(newBlock.payload)}
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
