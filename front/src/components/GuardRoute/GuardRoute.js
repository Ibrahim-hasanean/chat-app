import React from "react";
import { Redirect, Route } from "react-router-dom";
const GuardRoute = ({ component: Component, isAuth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default GuardRoute;
