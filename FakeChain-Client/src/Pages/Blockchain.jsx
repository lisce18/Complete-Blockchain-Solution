import React, { useEffect, useState } from 'react';
import NodeSelector from '../Components/NodeSelector';
import SearchTransaction from '../Components/SearchTransaction';
import TransactionForm from '../Components/TransactionForm';
import {
  getBlockchain,
  getNodes,
  addBlockchain,
} from '../services/fetchBlockchain';
import { displayBlockchain } from '../Components/DisplayBlockchain';
import { displayPending } from '../Components/DisplayPending';

export const Blockchain = () => {
  const [blockchain, setBlockchain] = useState({});
  const [blockchainList, setBlockchainList] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [availablePort, setAvailablePort] = useState('');
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNodes();
  }, [nodes]);

  useEffect(() => {
    if (availablePort) {
      fetchBlockchain(availablePort);
    }
  }, [availablePort, loading]);

  useEffect(() => {
    if (
      blockchain &&
      blockchain.payload &&
      Array.isArray(blockchain.payload.chain)
    ) {
      setBlockchainList(blockchain.payload.chain);
      setPendingTransactions(blockchain.payload.pendingTransactions || []);
    }
  }, [blockchain]);

  const fetchNodes = async () => {
    try {
      const fetchedNodes = await getNodes();
      setNodes(fetchedNodes);
      if (fetchedNodes.length > 0) {
        const firstNodeAddress = fetchedNodes[0].address;
        setAvailablePort(firstNodeAddress);
      }
    } catch (err) {
      console.error(`Error fetching nodes: ${err}`);
    }
  };

  const fetchBlockchain = async (port) => {
    try {
      const blockchainPayload = await getBlockchain(port);
      setBlockchain(blockchainPayload);
    } catch (err) {
      console.error(`Error fetching blockchain: ${err}`);
    }
  };

  const handleMine = async () => {
    setLoading(true);
    try {
      const result = await addBlockchain(availablePort);
    } catch (err) {
      console.error('Error while mining:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-container'>
      <div className='placement-1'>
        <NodeSelector
          className='dropdown'
          nodes={nodes}
          setAvailablePort={setAvailablePort}
        />{' '}
      </div>
      <div className='placement-2'>
        <div className='trx-search-container'>
          <SearchTransaction
            className='searchbar'
            availablePort={availablePort}
          />
          <TransactionForm
            getBlockchain={getBlockchain}
            availablePort={availablePort}
          />
        </div>
      </div>
      <div className='placement-3'>
        {pendingTransactions.length > 0 ? (
          <button
            onClick={handleMine}
            disabled={loading}
            className='mine-btn'
          >
            {loading ? 'Mining...' : 'Mine transactions'}
          </button>
        ) : (
          <h4 className='no-pending'>
            Make a new transaction before you can see pending...
          </h4>
        )}
        <div className='pending-transactions-container'>
          {pendingTransactions.length > 0 ? (
            <>
              <h3 className='pending-title'>Pending Transactions</h3>
              <ul className='pending-transactions'>
                {displayPending(pendingTransactions)}
              </ul>
            </>
          ) : null}
        </div>
        {blockchainList.length > 0 ? (
          <ul className='chain'>{displayBlockchain(blockchainList)}</ul>
        ) : (
          <p>No blockchain found</p>
        )}
      </div>
    </div>
  );
};
