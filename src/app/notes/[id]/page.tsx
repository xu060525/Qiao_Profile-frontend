"use client"; 

import React, { useState, useEffect } from "react"; 
import { useParams, useRouter } from "next/navigation"; 
import { API_BASE_URL } from "@/config";
import Link from "next/link";

interface Note {
  id: string; 
  content: string; 
  created_at: string; 
  title: string; 
}

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState("");

  const noteId = params.id as string; 

  useEffect(() => {
    if (noteId) {
      fetchNoteDetail();
    }
  }, [noteId]);

  const fetchNoteDetail = async() => {
    try {
      // 从后端获取单条笔记
      const res = await fetch(`${API_BASE_URL}/api/v1/notes/${noteId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Memory fragment not found.");
        throw new Error("Failed to fetch memory fragment.");
      }
      const data = await res.json(); 
      setNote(data); 
    } catch (err: any) {
      setError(err.message); 
    } finally {
      setIsLoading(false); 
    }
  }; 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pl-64 flex items-center justify-center">
        <div className="text-orange-500 font-mono animate-pulse">Decrypting memory...</div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pl-64 flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-mono">{error || "Fragment lost in the void."}</div>
        <button onClick={() => router.back()} className="text-neutral-500 hover:text-orange-500 transition-colors">
          &lt;- Return to base
        </button>
      </div>
    );
  }

  const title = note.title || `Fragment // ${note.id.substring(0, 8)}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pl-64 text-neutral-200">
      <main className="max-w-3xl mx-auto p-12">
        {/* 顶部导航 */}
        <div className="mb-12">
          <Link 
            href="/notes"
            className="text-neutral-500 hover:text-orange-500 font-mono text-sm flex items-center gap-2 transition-colors w-fit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            cd ..
          </Link>
        </div>

        {/* 文章头部信息 */}
        <header className="mb-12 border-b border-neutral-800/50 pb-8">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(note.created_at).toLocaleString()}
            </span>
            <span className="bg-neutral-900 px-2 py-1 rounded-md text-neutral-400">
              ID: {note.id}
            </span>
          </div>
        </header>

        {/* 核心内容渲染区：复用 Tailwind Typography 插件 */}
        <article 
          className="prose prose-invert prose-orange max-w-none prose-pre:bg-black prose-pre:border prose-pre:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </main>
    </div>
  );
}