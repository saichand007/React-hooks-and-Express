import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import { Navigate } from 'react-router-dom';
import { Fragment } from 'react';

const PrivateRoute = ({ component: Component }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  return (
    <Fragment>
      {!isAuthenticated && !loading ? <Navigate to='/login' /> : <Component />}
    </Fragment>
  );
};

export default PrivateRoute;
