import React, { useState, useEffect } from "react";
import SideBarFriends from "../SideBarFriends/SideBarFriends";
import axios from "axios";
import "./FriendsSideBar.css";
const FriendsSideBar = () => {
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    let getUsers = async () => {
      let url = "http://localhost:4000/users";
      let response = await axios.get(url, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      let filterUsers = response.data.users.filter(
        (user) => user._id !== userId
      );
      setUsers([...filterUsers]);
    };
    getUsers();
  }, [userId]);
  return (
    <div className="friend-sidbar-wrapper">
      <p>friends list</p>

      <input
        type="text"
        className="search-friend"
        placeholder="search for friends"
      />
      <div className="side-bar-friends-container">
        {users.map((user, index) => (
          <SideBarFriends key={index} user={user} />
        ))}
      </div>
    </div>
  );
};

export default FriendsSideBar;
