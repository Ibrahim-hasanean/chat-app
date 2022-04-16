import React, { useEffect, useContext } from "react";
import "./OnlineFriends.css";
import images from "../../assets/images/profile.jpeg";
import useSocketContext from "../../context/socketContext";

const OnlineFriends = ({ firend }) => {
  const { setCurrentUser, socket } = useSocketContext();
  return (
    <div
      onClick={() => {
        let senderId = localStorage.getItem("userId");
        setCurrentUser(firend);
        socket.emit("joinRoom", { senderId, reciverId: firend });
      }}
      className="online-friends-container"
    >
      <div className="online-friends">
        <div className="online-image-container">
          <img src={firend.imageURL || images} alt="" />
          <div className="online-icon"></div>
        </div>
        <h4>{firend.name}</h4>
      </div>
    </div>
  );
};

export default OnlineFriends;
