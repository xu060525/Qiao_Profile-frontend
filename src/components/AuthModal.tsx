"use client";

import { useState, useEffect } from "react"; 
import { createClient } from "@/utils/supabase/client";
import { findSourceMap } from "module";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal ({ isOpen, onClose }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>(""); 
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(""); 
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "ok" | "error">("checking");

  const supabase = createClient(); 

  useEffect(() => {
    if (!isOpen) return; 
    
    const checkConnection = async () => {
      try {
        // 弃用查表的测试方式，改用查 Auth 会话（这不会触发 RLS 拦截）
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        setConnectionStatus("ok");
      } catch (err) {
        console.error("Connection check failed:", err);
        setConnectionStatus("error");
      }
    };

    checkConnection();
  }, [isOpen, supabase]); 

  if (!isOpen) return null; 

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setMessage("请输入邮箱和密码"); 
      return; 
    }

    setLoading(true); 
    setMessage(""); 

    try {
      if (isLoginMode) {
        const { error } = await supabase.auth.signInWithPassword({ email, password }); 
        if (error) throw error; 
        setMessage("登陆成功！"); 
        setTimeout(onClose, 1000); 
      } else {
        const { error } = await supabase.auth.signUp({ email, password }); 
        if (error) throw error; 
        setMessage("注册成功！请查收验证邮件（如果有配置）"); 
      } 

    } catch (error: any) {
        setMessage(error.message || "发生未知错误"); 
    } finally {
        setLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#121212] border border-neutral-800 rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">
          {isLoginMode ? "进入控制台" : "创建超级权限"}
        </h2>
        
        <div className="flex items-center gap-2 mb-8 text-sm font-mono">
          <span className="text-neutral-500">DB Status:</span>
          {connectionStatus === "checking" && <span className="text-yellow-500 animate-pulse">Checking...</span>}
          {connectionStatus === "ok" && <span className="text-green-500">Connected</span>}
          {connectionStatus === "error" && <span className="text-red-500">Connection Failed</span>}
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="核心通信邮箱 (Email)"
            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="超级访问密钥 (Password)"
            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
          />
          
          {message && (
            <p className={`text-sm ${message.includes("成功") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleAuth}
            disabled={loading || connectionStatus !== "ok"}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-neutral-800 disabled:text-neutral-600 text-white py-3 rounded-xl font-medium transition-all mt-4"
          >
            {loading ? "验证中..." : isLoginMode ? "授权登录" : "注册核心账户"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setMessage("");
            }}
            className="text-sm text-neutral-500 hover:text-orange-400 transition-colors"
          >
            {isLoginMode ? "没有权限？切换到注册" : "已有权限？切换到登录"}
          </button>
        </div>
      </div>
    </div>
  );
}