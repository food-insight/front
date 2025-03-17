import React, { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex items-center p-2 border-t">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요..."
        className="flex-1 p-2 border border-gray-300 rounded-md"
      />
      <button onClick={handleSend} className="ml-2 p-2 bg-blue-500 text-white rounded-md">
        전송
      </button>
    </div>
  );
};

export default ChatInput;
