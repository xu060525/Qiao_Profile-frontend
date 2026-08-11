"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
import { createClient } from "@/utils/supabase/client";
import BlockEditor from "@/components/BlockEditor";
import { format } from "path";
import Link from "next/link";

interface Note {
  id: string;
  content: string;
  created_at: string;
  metadata?: {
    title?: string;
    format?: string;
    source?: string;
  };
}

// 站长专属白名单（只有这个邮箱能看到发布框）
const ADMIN_EMAIL = "2377392781@qq.com"; // <--- 请务必替换为你的邮箱！

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchNotes();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/notes/`);
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handlePublish = async () => {
    // 因为 TipTap 初始是 '<p></p>', 我们需要更严谨的判断是否为空
    const isEmpty = !newNote || newNote === '<p></p>' || newNote === '';
    if (isEmpty || !newTitle.trim()) return;
    
    setIsPublishing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/notes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newNote,
          metadata: { source: "web_client", format: "html" }  // 标记一下 HTML 格式
        })
      });

      if (res.ok) {
        setNewNote("");   // 清空状态，触发 Editor 的 useEffect 清空画布
        setNewTitle("");  // 发布成功后清空标题
        fetchNotes();     // 重新拉取列表
      }
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pl-64 text-neutral-200">
      <main className="max-w-4xl mx-auto p-12">
        <h1 className="text-3xl font-bold mb-8 text-white tracking-wide">
          Knowledge Base<span className="text-orange-500">.</span>
        </h1>

        {/* 权限门控：只有管理员才能看到这个输入框区域 */}
        {!isLoadingAuth && isAdmin && (
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 mb-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 rounded-l-2xl"></div>
            {/* 标题输入框 */}
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title..."
              className="w-full bg-transparent text-2xl font-bold text-white placeholder-neutral-700 border-none focus:outline-none mb-6 pb-4 border-b border-neutral-800/50"
            />

            {/* 支持实时 Markdown 渲染 */}
            <BlockEditor content={newNote} onChange={setNewNote} />
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-800/50">
              <span className="text-xs text-neutral-500 font-mono flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                Admin Access Granted
              </span>
              <button
                onClick={handlePublish}
                disabled={isPublishing || !newNote || newNote === '<p></p>'}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-orange-500/20"
              >
                {isPublishing ? "Syncing..." : "Commit /"}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {notes.map((note) => {
            // 尝试从元数据中提取标题，如果没有则用 ID 兜底
            const displayTitle = note.metadata?.title || `Fragment // ${note.id.substring(0, 8)}`;
            
            return (
              <Link 
                key={note.id} 
                href={`/notes/${note.id}`}
                className="block bg-[#121212] border border-neutral-800/60 rounded-2xl p-6 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* 悬停时的左侧高亮光带 */}
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <h2 className="text-xl font-bold text-neutral-200 mb-3 group-hover:text-orange-400 transition-colors">
                  {displayTitle}
                </h2>
                
                <div className="text-neutral-500 mb-4 font-mono text-xs flex items-center gap-4">
                  <span>{new Date(note.created_at).toLocaleString()}</span>
                </div>
                
                {/* 列表页的内容预览，我们用 CSS 的 line-clamp 截断它，防止太长 */}
                <div 
                  className="prose prose-invert prose-sm text-neutral-400 line-clamp-3 opacity-70"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </Link>
            );
          })}
          {notes.length === 0 && (
            <div className="text-center py-20 text-neutral-600 font-mono">
              / No memory fragments found. /
            </div>
          )}
        </div>
      </main>
    </div>
  );
}