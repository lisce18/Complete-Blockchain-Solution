import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className='navbar'>
      <ul>
        <li>
          <NavLink
            to={'/fakechain/home'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={'/fakechain/transaction'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Transaction
          </NavLink>
        </li>
        <li>
          <NavLink
            to={'/fakechain/mine'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Mine
          </NavLink>
        </li>
        <li>
          <NavLink
            to={'/fakechain/explorer'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Explorer
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
