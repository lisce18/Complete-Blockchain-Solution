import React from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Blockchain } from './Pages/Blockchain';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';
import { Home } from './Pages/Home';
import { Login } from './Pages/Login';
import { Register } from './Pages/Register';
import { UserProvider } from './Components/UserContext';

const userAuth = localStorage.getItem('user');
const tokenAuth = localStorage.getItem('token');

const redirect = () => {
  if (!userAuth || !tokenAuth) {
    return <Navigate to='/login' />;
  }
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />
          <Route
            path='/register'
            element={<Register />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/blockchain'
            element={redirect() || <Blockchain />}
          />
          <Route
            path='*'
            element={<Navigate to='/' />}
          />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
