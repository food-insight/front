import React from "react";

const ChatOutput = ({ messages }) => {
  return (
    <div className="h-96 overflow-y-auto border-b p-4">
      {messages.map((msg, index) => (
        <div key={index} className="mb-4">
          <div className="font-bold text-blue-500">사용자:</div>
          <div className="bg-gray-200 p-2 rounded-md">{msg.input}</div>

          <div className="font-bold text-green-600 mt-2">챗봇:</div>
          <div className="bg-white p-2 border border-gray-300 rounded-md">{msg.output}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatOutput;
