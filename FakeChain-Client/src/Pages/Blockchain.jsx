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
  const [dynamicPort, setDynamicPort] = useState('');
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNodes();
  }, [nodes]);

  useEffect(() => {
    if (dynamicPort) {
      fetchBlockchain(dynamicPort);
    }
  }, [dynamicPort, loading]);

  useEffect(() => {
    if (
      blockchain &&
      blockchain.payload &&
      Array.isArray(blockchain.payload.chain)
    ) {
      console.log('Blockchain chain payload:', blockchain.payload.chain);
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
        setDynamicPort(firstNodeAddress);
      }
    } catch (err) {
      console.error(`Error fetching nodes: ${err}`);
    }
  };

  const fetchBlockchain = async (port) => {
    try {
      const blockchainPayload = await getBlockchain(port);
      console.log('Fetched blockchain payload:', blockchainPayload);
      setBlockchain(blockchainPayload);
    } catch (err) {
      console.error(`Error fetching blockchain: ${err}`);
    }
  };

  const handleMine = async () => {
    setLoading(true);
    try {
      const result = await addBlockchain(dynamicPort);
    } catch (err) {
      console.error('Error while mining:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-container'>
      <NodeSelector
        className='dropdown'
        nodes={nodes}
        setDynamicPort={setDynamicPort}
      />
      <SearchTransaction dynamicPort={dynamicPort} />
      <TransactionForm
        getBlockchain={getBlockchain}
        dynamicPort={dynamicPort}
      />
      {pendingTransactions.length > 0 ? (
        <button
          onClick={handleMine}
          disabled={loading}
        >
          {loading ? 'Mining ...' : 'Mine pending transactions'}
        </button>
      ) : (
        'No Pending Transactions'
      )}
      <div className='transactions-container'>
        {pendingTransactions.length > 0 ? (
          <>
            <h3 className='pending-header'>Pending Transactions</h3>
            <ul className='pending-transactions'>
              {displayPending(pendingTransactions)}
            </ul>
          </>
        ) : null}
        {blockchainList.length > 0 ? (
          <ul className='chain'>{displayBlockchain(blockchainList)}</ul>
        ) : (
          <p>No blockchain found</p>
        )}
      </div>
    </div>
  );
};
