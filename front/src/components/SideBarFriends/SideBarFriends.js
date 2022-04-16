import React from "react";
import "./SideBarFriends.css";
import image from "../../assets/images/profile-icon.png";
import useSocketContext from "../../context/socketContext";

const SideBarFriends = ({ user }) => {
  const { setCurrentUser } = useSocketContext();
  return (
    <div onClick={() => setCurrentUser(user)} className="side-bar-friends">
      <img src={user.imageURL || image} alt="" />
      <h4>{user.name}</h4>
    </div>
  );
};

export default SideBarFriends;
