import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Geek System Core",
  description: "AI Powered Digital Garden",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-[#0a0a0a] text-neutral-200 flex min-h-screen selection:bg-orange-500/30`}>
        <Sidebar />
        <div className="flex-1 ml-64 min-h-screen overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}