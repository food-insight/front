import React, { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd" }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요..."
        style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: "10px",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        전송
      </button>
    </div>
  );
};

export default ChatInput;
