import React, { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input); // 부모 컴포넌트(Chatbot.js)로 메시지 전달
    setInput(""); // 입력창 초기화
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex items-center p-2 border-t bg-white">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요..."
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={handleKeyDown} // 엔터키 입력 시 메시지 전송
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        전송
      </button>
    </div>
  );
};

export default ChatInput;
