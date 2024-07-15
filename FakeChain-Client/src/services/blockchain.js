import axios from 'axios';

export const listBlocks = async () => {
  try {
    const response = await axios.get('http://localhost:5001/api/v1/blockchain');
    return response.payload;
  } catch (error) {
    return error.response.payload;
  }
};
