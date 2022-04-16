import React, { useState } from "react";
import "./MessageSend.css";
import useSocketContext from "../../context/socketContext";

const MessageSend = () => {
  const [message, setMessage] = useState();
  const { socket, currentUser } = useSocketContext();

  let sendMessage = async () => {
    if (message) {
      let senderId = localStorage.getItem("userId");
      socket.emit(
        "newMessage",
        { senderId, reciverId: currentUser._id, message },
        (ack) => {
          console.log(ack);
          setMessage("");
        }
      );
    }
  };

  let onTyping = (e) => {
    setMessage(e.target.value);
    // socket.emit("typing");
  };

  return (
    <div className="message-send">
      <textarea
        onChange={onTyping}
        value={message}
        placeholder="message"
        onFocus={() => socket.emit("typing")}
        onBlur={() => socket.emit("unTyping")}
      ></textarea>
      <div onClick={sendMessage} className="send-button-container">
        <button>send</button>
      </div>
    </div>
  );
};

export default MessageSend;
