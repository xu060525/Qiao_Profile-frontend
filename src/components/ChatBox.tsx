"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/config";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "你好，我是你的数字分身。今天想探索点什么？" }
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) {
      return;
    }

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });
      
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "ai", content: "网络请求失败，请检查后端状态。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pb-24 pr-4 space-y-6 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-5 py-3.5 text-[15px] leading-relaxed tracking-wide ${
              msg.role === "user" 
                ? "bg-orange-500 text-white rounded-3xl rounded-tr-sm shadow-md shadow-orange-500/20" 
                : "bg-neutral-800/50 text-neutral-100 rounded-3xl rounded-tl-sm border border-neutral-800"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800/50 text-orange-400 px-5 py-3.5 rounded-3xl rounded-tl-sm text-[15px] animate-pulse border border-neutral-800">
              思考中...
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-6 pb-2 pr-4">
        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-full px-2 py-2 shadow-lg focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="询问你的数字分身..."
            className="flex-1 bg-transparent border-none text-neutral-100 px-4 focus:outline-none placeholder:text-neutral-500"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-800 disabled:text-neutral-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
              <path d="M3.478 2.404a.75.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}