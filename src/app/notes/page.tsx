"use client";

import React, { useEffect, useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNotes = async (): Promise<void> => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/notes/");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handlePublish = async (): Promise<void> => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/notes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });
      
      if (res.ok) {
        setTitle("");
        setContent("");
        fetchNotes();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 p-6 md:p-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        <header className="border-b border-neutral-800/50 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">知识库</h1>
          <p className="text-neutral-500">所有的思考片段都会在这里被自动向量化，并编织进星空图谱。</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <section className="lg:col-span-1 bg-[#121212] border border-neutral-800/50 rounded-[2rem] p-6 shadow-2xl h-fit">
            <h2 className="text-lg font-medium text-neutral-300 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              发布新神经元
            </h2>
            
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="概念或标题..."
                className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              />
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入正文内容（支持长文本，后台会自动进行语义切块）..."
                rows={6}
                className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none scrollbar-thin scrollbar-thumb-gray-700"
              />
              
              <button
                onClick={handlePublish}
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-800 disabled:text-neutral-600 text-white py-3 rounded-xl font-medium transition-all shadow-md shadow-orange-500/10 mt-2"
              >
                {isSubmitting ? "正在注入高维空间..." : "发布到图谱"}
              </button>
            </div>
          </section>

          <section className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-lg font-medium text-neutral-300 mb-2 flex items-center gap-2">
              <span className="text-orange-500 font-bold">#</span>
              已存储的知识切片
            </h2>
            
            {isLoading ? (
              <div className="text-neutral-500 animate-pulse bg-[#121212] p-6 rounded-[2rem] border border-neutral-800/50">
                正在读取记忆...
              </div>
            ) : notes.length === 0 ? (
              <div className="text-neutral-500 bg-[#121212] p-6 rounded-[2rem] border border-neutral-800/50">
                知识库空空如也，快去发布第一篇笔记吧！
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {notes.map((note) => (
                  <div key={note.id} className="bg-[#121212] border border-neutral-800/50 rounded-2xl p-6 hover:border-orange-500/30 transition-colors group">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-neutral-400 text-sm line-clamp-3 leading-relaxed mb-4">
                      {note.content}
                    </p>
                    <div className="text-xs text-neutral-600 font-mono">
                      ID: {note.id.split("-")[0]}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}