import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className='navbar'>
      <ul>
        <li>
          <NavLink
            to='/'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/register'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Register
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/login'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Login
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/blockchain'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Blockchain
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
