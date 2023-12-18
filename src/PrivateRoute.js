import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Route {...rest} element={element} />
  } else {
    return <Navigate to="/login" />;
  };
};

export default PrivateRoute;

