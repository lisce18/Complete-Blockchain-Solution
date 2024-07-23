import React, { useState, useContext } from 'react';
import { registerUser } from '../services/fetchUser.js';
import { useNavigate } from 'react-router-dom';
import UserContext from '../Components/UserContext.jsx';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await registerUser({ email, password });
      login(response.token);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='main-container'>
      <h2 className='page-title'>Register</h2>
      <form
        className='register-form'
        onSubmit={handleSubmit}
      >
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className='form-control'>
          <label className='input-title'>Email: </label>
          <input
            type='text'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br />
        <div className='form-control'>
          <label className='input-title'>Password: </label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <button
          className='submit-register'
          type='submit'
        >
          Register
        </button>
      </form>
    </div>
  );
};
