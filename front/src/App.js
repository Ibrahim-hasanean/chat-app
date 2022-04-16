import { useEffect } from "react";
import "./App.css";
// import ChatPage from "./pages/Chat/ChatPage";
import ChatPage from "./pages/ChatPageContainer/ChatPageContainer";
import SignUp from "./pages/SignUp/SignUp";
import { ContextProvider } from "./context/socketContext";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login/Login";
import GuardRoute from "./components/GuardRoute/GuardRoute";
import { authContext } from "./context/authContext";
import { useState } from "react";
import axios from "axios";
function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      axios
        .get("http://localhost:4000/users/me", {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setUser(res.data.user);
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
  }, []);
  return (
    <div className="App">
      <Router>
        <div className="bar">Chat App</div>
        <Switch>
          <authContext.Provider value={{ isAuth, setIsAuth, user, setUser }}>
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/" component={Login} />
            {/* <ContextProvider> */}
            <GuardRoute
              // isAuth={isAuth}
              isAuth={true}
              exact
              path="/messanger"
              component={ChatPage}
            />
            {/* </ContextProvider> */}
          </authContext.Provider>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
