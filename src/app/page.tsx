import KnowledgeGraph from "@/components/KnowledgeGraph";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans selection:bg-orange-500/30">
      <div className="max-w-screen-2xl mx-auto p-4 md:p-8 flex flex-col min-h-screen">
        
        <header className="py-8 md:py-12 flex flex-col gap-3">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Developer</span>
          </h1>
          <p className="text-neutral-500 text-lg">
            探索你的专属数字花园与灵感神经元。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 mb-8">
          
          <section className="lg:col-span-3 bg-[#121212] rounded-[2rem] border border-neutral-800/50 shadow-2xl overflow-hidden flex flex-col">
            <div className="px-8 py-5 border-b border-neutral-800/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-lg">
                ✦
              </div>
              <h2 className="font-medium text-lg text-neutral-300">Knowledge Graph</h2>
            </div>
            <div className="flex-1 min-h-[500px]">
              <KnowledgeGraph />
            </div>
          </section>

          <section className="lg:col-span-2 bg-[#121212] rounded-[2rem] border border-neutral-800/50 shadow-2xl flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-neutral-800/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-lg">
                ✧
              </div>
              <h2 className="font-medium text-lg text-neutral-300">AI Assistant</h2>
            </div>
            <div className="flex-1 p-6 h-[600px] lg:h-auto">
              <ChatBox />
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}