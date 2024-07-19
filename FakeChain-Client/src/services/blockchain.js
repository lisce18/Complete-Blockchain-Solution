import axios from 'axios';

export const listBlocks = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5001/api/v1/blockchain',
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
