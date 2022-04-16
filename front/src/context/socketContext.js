import { useContext, createContext, useState, useEffect, useRef } from "react";
import socketIo from "socket.io-client";
import useAuthContext from "./authContext";
import Peer from "simple-peer";
export const socketContext = createContext();
// export const socket = socketIo("http://localhost:4000", {
//   transports: ["websocket"],
// });
export const socket = socketIo("http://aleef-app.herokuapp.com", {
  transports: ["websocket"],
});
console.log("socketttt", socket);
export default function useSocketContext() {
  return useContext(socketContext);
}

export const ContextProvider = ({ children }) => {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [mediaAcivated, setMediaAcivated] = useState(false);
  const [me, setMe] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [userTyping, setuserTyping] = useState(false);
  const [call, setCall] = useState();
  const [callType, setCallType] = useState();
  const { user } = useAuthContext();
  const myStream = useRef({});
  const userStream = useRef({});
  const connectionRef = useRef();

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    socket?.emit("online", { userId });
    socket?.on("onlineFriend", ({ friends }) => {
      let onlineFriends = friends.filter(
        (friend) => friend._id !== localStorage.getItem("userId")
      );
      setOnlineFriends([...onlineFriends]);
    });
    socket.on("newMessage", ({ message }) => {
      if (message) setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("userLeave", ({ socektId }) => {
      if (socektId == call?.from) setCall(null);
    });

    socket.on("me", ({ id, onlineFriends }) => {
      console.log("Me", id);
      setMe(id);
    });

    socket.on(
      "callUser",
      ({ from, name: callerName, signal, stream, callType }) => {
        console.log("Call User", { from, name: callerName, signal, stream });
        setCallType(callType);
        setCall({
          isReceivingCall: true,
          from,
          name: callerName,
          signal,
          stream,
        });
      }
    );

    socket.on("typing", () => {
      setuserTyping(true);
    });
    socket.on("unTyping", () => {
      setuserTyping(false);
    });

    socket.on("declineCall", () => {
      // myStream.current = null;
      myStream.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
      userStream.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
      setCallAccepted(false);
      setMediaAcivated(false);
      setCall(null);
      connectionRef.current = null;
      myStream.current = {};
      userStream.current = {};
      // window.location.reload();
    });

    socket.on("getUser", ({ user }) => {
      console.log(user);
      setCurrentUser(user);
      let senderId = localStorage.getItem("userId");
      socket.emit("joinRoom", { senderId, reciverId: user });
    });
  }, [socket]);
  useEffect(() => {
    let senderId = localStorage.getItem("userId");
    // socket.emit("joinRoom", { senderId, reciverId: currentUser });
    socket.on("joinRoom", (data) => {});
  }, [currentUser, socket]);

  const callUser = async (id, type = "audio") => {
    setCallType(type);
    navigator.mediaDevices
      .getUserMedia({ video: type === "video", audio: true })
      .then((stream) => {
        const peer = new Peer({ initiator: true, stream, trickle: false });
        peer.on("signal", (signal) => {
          socket.emit("callUser", {
            userToCall: id,
            signal,
            from: me,
            name: user.name,
            callType: type,
          });
        });
        peer.on("stream", (currentStream) => {
          userStream.current.srcObject = currentStream;
          console.log("callUser stream", currentStream);
        });
        // setStream(stream);
        setMediaAcivated(true);

        myStream.current.srcObject = stream;

        socket.on("callAccepted", async ({ signal }) => {
          setCallAccepted(true);
          console.log("call accepted", signal);
          peer.signal(signal);
        });
        setCall({ from: id });
        connectionRef.current = peer;
      });
  };

  const answerUser = async (type = "audio") => {
    setCallAccepted(true);
    navigator.mediaDevices
      .getUserMedia({ video: type === "video", audio: true })
      .then((stream) => {
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on("signal", (signal) => {
          socket.emit("answerCall", { signal, to: call.from });
          console.log("awerCall Signal", signal);
        });
        setMediaAcivated(true);
        peer.on("stream", (currentStream) => {
          if (!userStream.current) userStream.current = {};
          userStream.current.srcObject = currentStream;
          console.log("answerCall stream", currentStream);
        });
        if (!myStream.current) myStream.current = {};
        myStream.current.srcObject = stream;

        peer.signal(call.signal);
        connectionRef.current = peer;

        socket.emit("getUser", { name: call.name });
      });
  };

  let declineCall = () => {
    socket.emit("declineCall", { to: call.from });
    setCall(null);
  };

  let finishCall = () => {
    socket.emit("declineCall", { to: call.from });
    // connectionRef.current.destroy();
    myStream.current.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    userStream.current.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    console.log(myStream.current.srcObject);
    setCallAccepted(false);
    setMediaAcivated(false);
    connectionRef.current = null;
    myStream.current = {};
    userStream.current = {};

    setCall(null);
  };

  return (
    <socketContext.Provider
      value={{
        finishCall,
        declineCall,
        userTyping,
        setCallAccepted,
        myStream,
        userStream,
        socket,
        messages,
        setMessages,
        currentUser,
        setCurrentUser,
        onlineFriends,
        setOnlineFriends,
        mediaAcivated,
        answerUser,
        callUser,
        callAccepted,
        call,
        setCall,
        callType,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};
