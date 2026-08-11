"use client"

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import AuthModal from "./AuthModal";

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

export default function Sidebar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false); 

  const navItems: NavItem[] = [
    {
      name: "主控台",
      href: "/",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: "知识库",
      href: "/notes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <aside className="w-64 bg-[#121212] border-r border-neutral-800/50 flex flex-col h-screen fixed left-0 top-0 z-40">
        <div className="h-24 flex items-center px-8 border-b border-neutral-800/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20 mr-4">
            Sys
          </div>
          <span className="text-neutral-200 font-semibold text-xl tracking-wide">
            Core<span className="text-orange-500">.</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
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

        <div className="p-6 border-t border-neutral-800/50 flex flex-col gap-4">
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800/50 hover:bg-orange-500/20 text-neutral-300 hover:text-orange-400 rounded-xl border border-neutral-700/50 hover:border-orange-500/30 transition-all font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            System Login
          </button>

          <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] rounded-xl border border-neutral-800/50">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-neutral-400 font-mono">Backend Online</span>
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