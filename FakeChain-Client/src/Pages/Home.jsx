import { IconCheckbox } from '@tabler/icons-react';
import React from 'react';
import { API_URL } from '../services/config';

export const Home = () => {
  return (
    <main className='home-wrapper'>
      <section className='description-wrapper'>
        <h2>Description</h2>
        <div className='description pulsating-box'>
          FakeChain
          <br />
          <br />
          Hope it works
          <br />
          <br />
        </div>
      </section>
    </main>
  );
};
