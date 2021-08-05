  
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { getKeyInStorage } from './ManageStore';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>    
      getKeyInStorage('token') ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: '/login', state: { from: props.location } }}
        />
      )
    }
  />
);