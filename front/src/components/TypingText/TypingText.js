import React, { useRef, useEffect } from "react";
import "./TypingTest.css";
const TypingText = ({ user }) => {
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <p className="typing-text" ref={scrollRef}>
      {user.name} is typing...
    </p>
  );
};

export default TypingText;
