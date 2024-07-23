import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthentication } from './UserContext';

export const RouteProtection = ({ children }) => {
  const { user } = useAuthentication();
  return user ? children : <Navigate to='/login' />;
};
