import React, { createContext, useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token, userPayload) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userPayload));
    setToken(token);
    setUser(userPayload);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useAuthentication = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuthentication must be used within an UserProvider');
  }
  return context;
};

export { UserProvider, useAuthentication };
export default UserContext;
