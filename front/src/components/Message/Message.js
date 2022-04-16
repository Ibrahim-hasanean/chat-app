import React, { useEffect, useRef } from "react";
import "./Message.css";
import image from "../../assets/images/profile.jpeg";
const Message = ({ owned, message }) => {
  const messageRef = useRef();

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <div
      ref={messageRef}
      className={`message-container ${
        owned ? "own-container" : "recived-container"
      }`}
    >
      <img className="message-image" src={image} alt="" />
      <div className="message">
        <div
          className={`message-text ${
            owned ? "own-message" : "recived-message"
          }`}
        >
          {message.message}
        </div>
        <p className="message-time">1 hour ago</p>
      </div>
    </div>
  );
};

export default Message;
