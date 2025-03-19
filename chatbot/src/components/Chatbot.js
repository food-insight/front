import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([{ text: "안녕하세요! 무엇을 도와드릴까요?", sender: "bot" }]);

  const sendMessage = async (message) => {
    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:8080/chat", { message });
      setMessages((prev) => [...prev, { text: response.data.reply, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "서버 오류가 발생했습니다.", sender: "bot" }]);
    }
  };

  return (
    <div style={{ width: "400px", margin: "auto", border: "1px solid #ddd", borderRadius: "10px", padding: "20px" }}>
      <div style={{ height: "300px", overflowY: "auto", padding: "10px", borderBottom: "1px solid #ddd" }}>
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default Chatbot;
