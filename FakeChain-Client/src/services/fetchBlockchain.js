const BASE_URL = 'http://localhost:5001/api/v1';

const handleGet = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error: HTTP status ${response.status} while fetching.`);
      return {};
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Error: Received non-JSON response');
      return {};
    }
    const payload = await response.json();
    return payload;
  } catch (err) {
    console.error(`Error: ${err} while fetching.`);
    return {};
  }
};

const addBlockchain = async (dynamicPort) => {
  const DYNAMIC_URL = `http://localhost:${dynamicPort}/api/v1/blockchain/mine`;
  try {
    const response = await fetch(DYNAMIC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(`Error: ${err} while mining.`);
  }
};

const getBlockchain = async (dynamicPort) => {
  const DYNAMIC_URL = `http://localhost:${dynamicPort}/api/v1/blockchain`;
  return handleGet(DYNAMIC_URL);
};

const getNodes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/nodes/`);
    const payload = await response.json();
    return payload.nodes;
  } catch (err) {
    console.error(`Error fetching nodes: ${err}`);
    return [];
  }
};

const makeTransaction = async (trxPayload, dynamicPort) => {
  const DYNAMIC_URL = `http://localhost:${dynamicPort}/api/v1/wallet/transaction`;
  try {
    const response = await fetch(DYNAMIC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trxPayload),
    });
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(`Error: ${err} while adding transaction.`);
    return {};
  }
};

export { getNodes, getBlockchain, makeTransaction, addBlockchain };
