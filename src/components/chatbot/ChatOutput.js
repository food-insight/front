import React from "react";

const ChatOutput = ({ messages }) => {
  return (
    <div className="chat-output">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatOutput;
