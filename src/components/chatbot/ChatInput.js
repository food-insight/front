import React, { useState } from "react";
import axios from "axios";

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/chat",  // 백엔드 API 주소
        { message: input },
        { headers: { Authorization: `Bearer YOUR_JWT_TOKEN` } }
      );
      onSend({ text: response.data.response, sender: "bot" });
    } catch (error) {
      console.error("챗봇 오류:", error);
      onSend({ text: "에러 발생! 다시 시도해주세요.", sender: "bot" });
    }

    setInput("");
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요..."/>
      <button onClick={handleSend}>전송</button>
    </div>
  );
};

export default ChatInput;
