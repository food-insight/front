import React, { useState } from "react";
import ChatInput from "./ChatInput";
import ChatOutput from "./ChatOutput";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = async (input) => {
    const userMessage = { input, output: "⏳ 응답을 기다리는 중..." };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // **백엔드 연결 전이라면 여기서 더미 응답 사용**
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prevMessages) =>
        prevMessages.map((msg, idx) =>
          idx === prevMessages.length - 1 ? { ...msg, output: data.response } : msg
        )
      );
    } catch (error) {
      console.error("백엔드 오류:", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg, idx) =>
          idx === prevMessages.length - 1 ? { ...msg, output: "⚠️ 오류 발생! 다시 시도해주세요." } : msg
        )
      );
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 border border-gray-300 rounded-lg">
      <ChatOutput messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default Chatbot;
