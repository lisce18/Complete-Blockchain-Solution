import React, { useState } from 'react';

const getTrxById = async (trxId, dynamicPort) => {
  try {
    const response = await fetch(
      `http://localhost:${dynamicPort}/api/v1/transactions/${trxId}`
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

const SearchTransaction = ({ dynamicPort }) => {
  const [searchId, setSearchId] = useState('');
  const [blockPayload, setBlockPayload] = useState(null);

  const handleInputChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleSearch = async (searchId) => {
    const payload = await getTrxById(searchId, dynamicPort);
    setBlockPayload(payload);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(searchId);
        }}
        className='search-container'
      >
        <input
          type='text'
          placeholder='Input a transaction id..'
          value={searchId}
          onChange={handleInputChange}
          className='search-input'
        />

        <button
          className='submit-button'
          type='submit'
        >
          Search
        </button>
      </form>
      {blockPayload && (
        <div>
          <h2>Block Details</h2>
          <pre>{JSON.stringify(blockPayload, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SearchTransaction;
