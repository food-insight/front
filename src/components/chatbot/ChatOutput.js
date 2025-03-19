import React from "react";

const ChatOutput = ({ messages }) => {
  return (
    <div className="chat-output p-4 border rounded-md h-96 overflow-y-auto bg-white shadow">
      {messages.length === 0 ? (
        <p className="text-gray-500">대화가 없습니다. 메시지를 입력하세요.</p>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded-md ${
              msg.type === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatOutput;
