import React, { useState } from "react";
import "./AuthForm.css";
import axios from "axios";
import useAuthContext from "../../context/authContext";
import { useHistory } from "react-router-dom";
const AuthForm = ({ page }) => {
  const [data, setData] = useState({});
  const { setIsAuth, setUser } = useAuthContext();
  let history = useHistory();
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setData({ ...data, [name]: value });
  };
  const submit = async (e) => {
    const URL = `http://localhost:4000/${String(page).toLowerCase()}`;
    e.preventDefault();
    if (data.name && data.password) {
      console.log(URL);
      try {
        let auth = await axios.post(URL, data);
        setIsAuth(true);
        let response = auth.data;
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.user._id);
        history.push("/messanger");
        setUser(response.user);
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <div className="login-container">
      <form onSubmit={submit} className="login">
        <h1>{page}</h1>
        <input
          onChange={handleChange}
          name="name"
          className="input-text"
          placeholder="name"
          type="text"
        />
        <input
          onChange={handleChange}
          name="password"
          className="input-text"
          placeholder="password"
          type="password"
        />
        <input className="input-submit" type="submit" value="login" />
      </form>
    </div>
  );
};

export default AuthForm;
