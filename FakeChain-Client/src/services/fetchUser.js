const API_BASE_URL = 'http://localhost:5001/api/v1/user';

const handleFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        // If the response is not JSON, use the status text
        errorData = { msg: response.statusText };
      }
      throw new Error(errorData.msg || 'Server error');
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch Error: ${error.message}`);
    throw new Error(`Error: ${error.message}`);
  }
};

export const registerUser = async (userPayload) => {
  try {
    const response = await handleFetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPayload),
    });
    return response;
  } catch (error) {
    throw new Error(`Error registering user: ${error.message}`);
  }
};

export const loginUser = async (userPayload) => {
  try {
    const response = await handleFetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPayload),
    });

    if (!response.token || !response.user) {
      throw new Error('Invalid response from server');
    }

    return {
      token: response.token,
      user: response.user,
    };
  } catch (error) {
    throw new Error(`Error logging in user: ${error.message}`);
  }
};
