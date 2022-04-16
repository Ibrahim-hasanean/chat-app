import React from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
const Login = () => {
  const submit = (e) => {
    e.preventDefault();
  };

  return <AuthForm page="SignUp" submit={submit} />;
};

export default Login;
