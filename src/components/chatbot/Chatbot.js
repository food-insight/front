import React, { useState } from "react";
import ChatInput from "./ChatInput";
import ChatOutput from "./ChatOutput";

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // 메시지 상태 관리

  const sendMessage = async (message) => {
    if (!message.trim()) return; // 빈 메시지 방지

    const requestBody = {
      user_id: 1, // 사용자 ID (임시 설정, 백엔드에서 JWT 필요하면 수정해야 함)
      message: message,
    };

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // 새로운 메시지를 추가 (사용자 메시지 + 챗봇 응답)
        setMessages([...messages, { text: message, sender: "user" }, { text: data.response, sender: "bot" }]);
      } else {
        console.error("API 요청 실패:", data);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <div className="h-96 overflow-y-auto p-4 bg-gray-100 rounded-md">
        {messages.map((msg, index) => (
          <ChatOutput key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default Chatbot;
