import React, { useContext } from 'react';
import { useAuthentication } from '../Components/UserContext';

export const Home = () => {
  const { isAuthenticated = false, logout = () => {} } = useAuthentication();

  return (
    <div className='main-container'>
      <h2 className='page-title'>FakeChain</h2>
      {isAuthenticated ? (
        <div className='info-container'>
          <p className='info'>You are logged in!</p>
          <button
            className='logout-btn'
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p className='info'>
            You are not logged in. Please log in or register.
          </p>
          <div className='btn-container'>
            <button
              className='login-btn'
              onClick={() => (window.location.href = '/login')}
            >
              Login
            </button>
            <button
              className='register-btn'
              onClick={() => (window.location.href = '/register')}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
