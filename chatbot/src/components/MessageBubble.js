import React from "react";

const MessageBubble = ({ text, sender }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: sender === "user" ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: sender === "user" ? "#007bff" : "#f1f1f1",
          color: sender === "user" ? "white" : "black",
          maxWidth: "60%",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
