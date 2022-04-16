import React from "react";
import "./VideoPlayer.css";
const VideoPlayer = ({ videoRef, name }) => {
  return (
    <video
      style={{ width: "300px" }}
      name={name}
      muted={name === "myVideo"}
      autoPlay
      playsInline
      ref={videoRef}
      className="videoContainer"
    />
  );
};

export default VideoPlayer;
