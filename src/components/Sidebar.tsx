"use client"

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthModal from "./AuthModal";

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

interface FolderNode {
  name: string;
  icon?: ReactNode;
  subFolders?: FolderNode[];
}

export default function Sidebar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFoldersOpen, setIsFoldersOpen] = useState<boolean>(true);
  
  // 用于高亮当前选中的专栏
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "Inbox";

  const navItems: NavItem[] = [
    {
      name: "主控台",
      href: "/",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "全部知识",
      href: "/notes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  // 模拟的专栏树状数据（未来可以从后端 API 动态获取）
  const folders: FolderNode[] = [
    {
      name: "Inbox",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
    },
    {
      name: "硬件工程",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      subFolders: [
        { name: "ESP32-FPGA主从系统" }
      ]
    }
  ];

  return (
    <>
      <aside className="w-64 bg-[#121212] border-r border-neutral-800/50 flex flex-col h-screen fixed left-0 top-0 z-40 overflow-y-auto hidden-scrollbar">
        {/* 顶部 Logo 区 */}
        <div className="h-24 flex-shrink-0 flex items-center px-8 border-b border-neutral-800/50 sticky top-0 bg-[#121212] z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20 mr-4">
            Sys
          </div>
          <span className="text-neutral-200 font-semibold text-xl tracking-wide">
            Core<span className="text-orange-500">.</span>
          </span>
        </div>

        {/* 主导航区 */}
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-2xl transition-all font-medium"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 分隔线 */}
        <div className="px-8 py-2">
          <div className="h-px w-full bg-neutral-800/50"></div>
        </div>

        {/* 专栏树区 (Folder Tree) */}
        <div className="flex-1 px-4 py-2">
          <button 
            onClick={() => setIsFoldersOpen(!isFoldersOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-mono tracking-widest text-neutral-600 hover:text-neutral-400 transition-colors uppercase group"
          >
            <span>Directories</span>
            <svg 
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isFoldersOpen ? 'rotate-90 text-orange-500' : 'group-hover:text-orange-500'}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className={`mt-2 space-y-1 overflow-hidden transition-all duration-300 origin-top ${isFoldersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            {folders.map((folder, idx) => {
              const isActive = currentCategory === folder.name;
              return (
                <div key={idx} className="flex flex-col">
                  {/* 一级文件夹 */}
                  <Link 
                    href={`/notes?category=${encodeURIComponent(folder.name)}`}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium
                      ${isActive 
                        ? 'text-orange-400 bg-orange-500/10 shadow-inner shadow-orange-500/5' 
                        : 'text-neutral-500 hover:text-orange-400 hover:bg-neutral-800/50'
                      }`}
                  >
                    {folder.icon || (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    )}
                    {folder.name}
                  </Link>

                  {/* 二级子文件夹 */}
                  {folder.subFolders && (
                    <div className="ml-5 mt-1 border-l border-neutral-800 pl-2 space-y-1">
                      {folder.subFolders.map((sub, subIdx) => {
                        const isSubActive = currentCategory === sub.name;
                        return (
                          <Link 
                            key={subIdx}
                            href={`/notes?category=${encodeURIComponent(sub.name)}`}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs
                              ${isSubActive
                                ? 'text-orange-400 bg-orange-500/10'
                                : 'text-neutral-600 hover:text-orange-400 hover:bg-neutral-800/50'
                              }`}
                          >
                            <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部系统状态与登录区 */}
        <div className="flex-shrink-0 p-6 border-t border-neutral-800/50 bg-[#121212] flex flex-col gap-4">
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800/50 hover:bg-orange-500/20 text-neutral-300 hover:text-orange-400 rounded-xl border border-neutral-700/50 hover:border-orange-500/30 transition-all font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            System Login
          </button>

          <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] rounded-xl border border-neutral-800/50 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-xs text-neutral-400 font-mono tracking-wide">Backend Online</span>
          </div>
        </div>
      </aside>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}