import axios from 'axios';

export const register = async (payload) => {
  try {
    const response = await axios.post(
      'http://localhost:5001/api/v1/user/register',
      payload
    );
    return response.payload;
  } catch (error) {
    return error.response.payload;
  }
};

export const login = async (payload) => {
  try {
    const response = await axios.post(
      'http://localhost:5001/api/v1/user/login',
      payload
    );
    return response.payload;
  } catch (error) {
    return error.response.payload;
  }
};

export const aboutMe = async (token) => {
  try {
    const response = await axios.get(
      'http://localhost:5001/api/v1/user/aboutme',
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return response.payload.payload;
  } catch (error) {
    return error.response.payload;
  }
};

export const update = async (token, payload) => {
  try {
    const response = await axios.put(
      'http://localhost:5001/api/v1/user/updateuser',
      {
        email: payload.email,
        username: payload.username,
        name: payload.name,
      },
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

export const updatePassword = async (token, payload) => {
  try {
    const response = await axios.put(
      'http://localhost:5001/api/v1/user/updatepassword',
      {
        password: payload.password,
        newPassword: payload.newpassword,
      },
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
