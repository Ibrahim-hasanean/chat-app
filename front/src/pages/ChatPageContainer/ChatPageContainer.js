import React from "react";
import { ContextProvider } from "../../context/socketContext";
import ChatPage from "../Chat/ChatPage";
const ChatPageContainer = () => {
  return (
    <ContextProvider>
      <ChatPage />
    </ContextProvider>
  );
};

export default ChatPageContainer;
