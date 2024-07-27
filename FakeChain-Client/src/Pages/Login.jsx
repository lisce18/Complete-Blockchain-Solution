import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { loginUser } from '../services/fetchUser.js';
import { useAuthentication } from '../Components/UserContext.jsx';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser({ email, password });
      login(response.token, response.user);
      window.location.href = '/blockchain';
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='main-container'>
      <h2 className='page-title'>Login</h2>
      <form
        className='login-form'
        onSubmit={handleSubmit}
      >
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className='form-control'>
          <label
            className='input-title'
            htmlFor='email'
          >
            Email:{' '}
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div className='form-control'>
          <label
            className='input-title'
            htmlFor='password'
          >
            Password:{' '}
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button
          className='submit-login'
          type='submit'
        >
          Login
        </button>
      </form>
    </div>
  );
};
