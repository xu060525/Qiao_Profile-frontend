"use client";

import { useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "你好！我是主人的数字分身。我已经读取了他的知识库，随便问我关于他的专业技能或笔记的问题吧！" }
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });
      
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "ai", content: "大脑暂时失联，请检查后端服务是否运行。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-800 rounded-xl bg-black/50 backdrop-blur-sm p-4 shadow-xl shadow-blue-900/10">
      <div className="border-b border-gray-800 pb-3 mb-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        <h2 className="text-gray-300 font-bold tracking-wider">AI Clone Terminal</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-br-none" 
                : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-400 p-3 rounded-lg rounded-bl-none text-sm animate-pulse border border-gray-700">
              正在搜索记忆并生成回复...
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="输入您的问题..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          发送
        </button>
      </div>
    </div>
  );
}