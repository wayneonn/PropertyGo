import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isLoggedIn = localStorage.getItem('loggedInAdmin');

  return isLoggedIn ? <Outlet/> : <Navigate to="/" />;
};

export default PrivateRoute;