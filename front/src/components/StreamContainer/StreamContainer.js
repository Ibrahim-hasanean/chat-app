import React from "react";
import "./StreamContainer.css";
import useScoketContext from "../../context/socketContext";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import AudioContainer from "../AudioContainer/AudioContainer";
const StreamContainer = () => {
  const {
    callAccepted,
    mediaAcivated,
    myStream,
    userStream,
    callType,
    finishCall,
  } = useScoketContext();
  return (
    <div className="streamBox">
      <div className="streamContainer">
        {mediaAcivated &&
          (callType === "video" ? (
            <VideoPlayer name="myVideo" videoRef={myStream} />
          ) : (
            <AudioContainer name="myVideo" videoRef={myStream} />
          ))}
        {callAccepted &&
          (callType === "video" ? (
            <VideoPlayer name="userVideo" videoRef={userStream} />
          ) : (
            <AudioContainer name="userVideo" videoRef={userStream} />
          ))}
      </div>
      <button onClick={() => finishCall()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="38"
          height="38"
          fill="currentColor"
          className="bi bi-x-circle-fill"
          viewBox="0 0 16 16"
          color="red"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
        </svg>
      </button>
    </div>
  );
};

export default StreamContainer;
