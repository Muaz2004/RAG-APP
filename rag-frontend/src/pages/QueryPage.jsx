import React, { useState } from "react";
import { queryRAG } from "../services/ragApi";

export default function QuerySection() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Add user question to chat
    const newChat = [...chatHistory, { type: "user", text: question }];
    setChatHistory(newChat);
    setQuestion("");
    setLoading(true);

    try {
      const res = await queryRAG(question);
      // Add AI answer
      setChatHistory([...newChat, { type: "ai", text: res.answer }]);
    } catch {
      setChatHistory([...newChat, { type: "ai", text: "Failed to fetch response." }]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.type === "user" ? "user" : "ai"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="chat-bubble ai">...</div>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <button onClick={handleAsk}>Ask</button>
      </div>
    </div>
  );
}
