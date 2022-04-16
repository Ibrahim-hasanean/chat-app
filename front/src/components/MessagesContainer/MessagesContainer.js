import React, { useState, useRef, useEffect } from "react";
import Message from "../Message/Message";
import "./MessagesContainer.css";
import useSocketContext from "../../context/socketContext";
import axios from "axios";
import CallingPopup from "../CallingPopup/CallingPopup";
import TypingText from "../TypingText/TypingText";
const MessagesContainer = () => {
  let userId = localStorage.getItem("userId");
  // const { currentUser } = useAuthContext();
  const { messages, setMessages, currentUser, call, userTyping } =
    useSocketContext();

  useEffect(() => {
    let getMessages = async () => {
      let response = await axios.get(
        `http://localhost:4000/users/messages?senderId=${userId}&reciverId=${currentUser?._id}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      setMessages(response.data?.messages || []);
    };
    if (currentUser) getMessages();
  }, [currentUser, userId]);
  return currentUser ? (
    <div className="messages-container">
      {messages.map((message) => (
        <div key={message._id}>
          <Message message={message} owned={message.sender === userId} />
        </div>
      ))}
      {userTyping && <TypingText user={currentUser} />}
      {call && <CallingPopup />}
    </div>
  ) : (
    <>
      <div className="messages-container no-conversation">
        No Conversation open
      </div>
      {call && <CallingPopup />}
    </>
  );
};

export default MessagesContainer;
