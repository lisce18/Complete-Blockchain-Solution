import axios from 'axios';

export const listTransactions = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5001/api/v1/wallet/transactions',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.payload;
  } catch (error) {
    return error.response.payload;
  }
};

export const sendTransaction = async (payload, token) => {
  try {
    const response = await axios.post(
      'http://localhost:5001/api/v1/wallet/transaction',
      payload,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.payload;
  } catch (error) {
    return error.response.payload;
  }
};

export const mine = async (token) => {
  try {
    const response = await axios.get(
      'http://localhost:5001/api/v1/wallet/mine',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.payload;
  } catch (error) {
    return error.response.payload;
  }
};

export const calculateBalance = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5001/api/v1/wallet/info',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.payload;
  } catch (error) {
    return error.response.payload;
  }
};
