import React, { useEffect, useState } from 'react';
import { listBlocks } from '../services/blockchain';
import {
  IconBox,
  IconDna,
  IconSquareChevronsRight,
  IconTopologyStarRing3,
} from '@tabler/icons-react';
import { formatTimestamp, shortenKey } from '../services/misc';
import { Popup } from '../Components/Popup';

export const Explorer = () => {
  const [blockchain, setBlockchain] = useState(false);
  const [showBlock, setShowBlock] = useState(null);
  const [displayPopup, setDisplayPopup] = useState('');

  const formatLatest = (payload) => {
    return payload.map((tx, txIndex) => (
      <React.Fragment key={txIndex}>
        <>
          <div className='blockchain-value'>
            Batch {txIndex === 0 ? 'A' : 'B'}:
          </div>
        </>
        <div className='blockchain-value'>
          Sender: {shortenKey(tx.inputMap.address)}
        </div>

        <>
          {Object.entries(tx.outputMap).map(([address, value], index) => {
            const senderAddress = tx.inputMap.address;
            if (address !== senderAddress) {
              return (
                <div
                  className='blockchain-value'
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

  useEffect(() => {
    const showBlockchain = async () => {
      try {
        const chain = await listBlocks();
        setBlockchain(true);
        if (chain) {
          const block = chain.payload.map((block, index) => (
            <section key={block.hash}>
              {index !== 0 ? (
                <div className='block pulsating-box'>
                  <h3>
                    {' '}
                    <IconBox /> Block payload:
                  </h3>
                  <div className='blockchain-single'>
                    Time: {formatTimestamp(block.timestamp)}
                  </div>
                  <div className='blockchain-single'>Hash: {block.hash}</div>
                  <div className='blockchain-single'>
                    lastHash: {block.lastHash}
                  </div>
                  <div className='blockchain-single'>Nonce: {block.nonce}</div>
                  <div className='blockchain-single'>
                    Difficulty: {block.difficulty}
                  </div>
                  <h3>
                    {' '}
                    <IconSquareChevronsRight />
                    Transactions included in this block:
                  </h3>
                  <div className='blockchain-multi'>
                    {formatLatest(block.payload)}
                  </div>
                </div>
              ) : (
                <div className='block pulsating-box'>
                  <div className='blockchain-single'>
                    Time: {formatTimestamp(block.timestamp)}
                  </div>
                  <div className='blockchain-single'>Hash: {block.hash}</div>
                  <div className='blockchain-single'>
                    lastHash: {block.lastHash}
                  </div>
                  <div className='blockchain-single'>Nonce: {block.nonce}</div>
                  <div className='blockchain-single'>
                    Difficulty: {block.difficulty}
                  </div>
                </div>
              )}
              <div className='connector-wrapper'>
                {index !== 0 ? (
                  <div className='connector'>
                    <div>
                      <IconDna />
                    </div>
                  </div>
                ) : (
                  <div className='connector'>
                    <div>
                      <IconTopologyStarRing3 />
                    </div>
                  </div>
                )}
              </div>
            </section>
          ));
          setShowBlock(block);
        }
      } catch (error) {
        return setDisplayPopup({ title: 'Error', text: 'Server error' });
      }
    };
    showBlockchain();
  }, []);

  return (
    <>
      <main className='explorer-wrapper'>
        <h2>Blockchain overview</h2>
        <section className='show-blocks'>
          {blockchain && <>{showBlock}</>}
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
