import React, { useEffect } from "react";
import FriendsSideBar from "../../components/FriendsSideBar/FriendsSideBar";
import MessagesContainer from "../../components/MessagesContainer/MessagesContainer";
import MessageSend from "../../components/MessageSend/MessageSend";
import OnlineFriends from "../../components/OnlineFriends/OnlineFriends";
import "./ChatPage.css";
import useScoketContext from "../../context/socketContext";
import OpenedConversationHeader from "../../components/OpenedConversationHeader/OpenedConversationHeader";
import StreamContainer from "../../components/StreamContainer/StreamContainer";
const ChatPage = () => {
  const { currentUser, onlineFriends, mediaAcivated, socket } =
    useScoketContext();
  useEffect(() => {
    socket.emit("me");
  }, []);
  return (
    // <ContextProvider>
    <div className="chat-page">
      <div className="friends-sideBar">
        <FriendsSideBar />
      </div>
      <div className="conversation">
        {currentUser ? <OpenedConversationHeader /> : <div></div>}
        {mediaAcivated && <StreamContainer />}
        {!mediaAcivated && <MessagesContainer />}
        {!mediaAcivated && currentUser && <MessageSend />}
      </div>
      <div className="chat-online">
        <h3>Online Friends</h3>
        {onlineFriends.map((firend, index) => (
          <OnlineFriends firend={firend} key={index} />
        ))}
      </div>
    </div>
    // </ContextProvider>
  );
};

export default ChatPage;
