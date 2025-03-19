import React, { useState } from "react";
import ChatInput from "./ChatInput";
import ChatOutput from "./ChatOutput";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);

  // 메시지 전송 함수
  const sendMessage = async (message) => {
    const newMessages = [...messages, { text: message, type: "user" }];
    setMessages(newMessages);

    try {
      const response = await axios.post("http://localhost:8000/chatbot", { message });
      setMessages([...newMessages, { text: response.data.reply, type: "bot" }]);
    } catch (error) {
      setMessages([...newMessages, { text: "에러 발생! 다시 시도해주세요.", type: "bot" }]);
    }
  };

  return (
    <div className="chat-container w-full max-w-lg mx-auto p-4 border rounded-lg shadow-md">
      <ChatOutput messages={messages} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default Chatbot;
