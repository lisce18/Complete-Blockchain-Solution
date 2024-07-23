import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { IconDnaOff } from '@tabler/icons-react';

export const Header = () => {
  const text = 'FakeChain';
  return (
    <header className='header'>
      <section className='first-row-wrapper'>
        <a
          className='logo-wrapper'
          href='home'
        >
          <h1 className='title'>
            {text.split('').map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </h1>
          <div className='logo'>
            <IconDnaOff />
          </div>
        </a>
      </section>
      <Navbar />
    </header>
  );
};
