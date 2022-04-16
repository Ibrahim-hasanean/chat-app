import React from "react";

const AudioContainer = ({ audioSource, name }) => {
  return (
    <audio name={name} controls autoPlay>
      <source autoPlay type="audio/mpeg" ref={audioSource}></source>
      <source autoPlay type="audio/ogg" ref={audioSource}></source>
    </audio>
  );
};

export default AudioContainer;
