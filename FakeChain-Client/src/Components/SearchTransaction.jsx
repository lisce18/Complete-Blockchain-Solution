import React, { useState } from 'react';

const getTransactionById = async (transactionId, availablePort) => {
  try {
    const response = await fetch(
      `http://localhost:${availablePort}/api/v1/wallet/${transactionId}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const payload = await response.json();
    return payload;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

const SearchTransaction = ({ availablePort }) => {
  const [searchId, setSearchId] = useState('');
  const [blockPayload, setBlockPayload] = useState(null);

  const handleInputChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleSearch = async (searchId) => {
    const payload = await getTransactionById(searchId, availablePort);
    setBlockPayload(payload);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderBlockPayload = (blockPayload) => {
    if (typeof blockPayload !== 'object' || blockPayload === null) {
      return <div>Invalid payload</div>;
    }

    return (
      <div>
        {Object.entries(blockPayload).map(([key, value]) => (
          <div
            key={key}
            style={{ marginBottom: '10px' }}
          >
            <strong>{capitalizeFirstLetter(key)}:</strong>{' '}
            {JSON.stringify(value, null, 2)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='search-trx-container'>
      <h3 className='search-title'>Search for transaction by id:</h3>
      <form
        className='search-trx-form'
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(searchId);
        }}
      >
        <input
          type='text'
          placeholder='Input a transaction id..'
          value={searchId}
          onChange={handleInputChange}
        />

        <button
          className='submit-btn'
          type='submit'
        >
          Search
        </button>
      </form>
      {blockPayload && (
        <div className='transaction-details'>
          <h2>Transaction Details</h2>
          <div>{renderBlockPayload(blockPayload)}</div>
        </div>
      )}
    </div>
  );
};

export default SearchTransaction;
