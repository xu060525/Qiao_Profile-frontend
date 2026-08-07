import KnowledgeGraph from "@/components/KnowledgeGraph";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white selection:bg-blue-500 selection:text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto mb-10 border-b border-gray-800 pb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
          System<span className="text-blue-500">.</span>Init()
        </h1>
        <p className="text-gray-400 text-lg font-mono">
          &gt; 加载个人知识库模块... 成功.<br />
          &gt; 唤醒 AI 交互终端... 成功.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-gray-400 font-mono text-sm pl-1">&gt; 神经元星空图谱</h3>
          <KnowledgeGraph />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-gray-400 font-mono text-sm pl-1">&gt; 交互式克隆体</h3>
          <ChatBox />
        </div>
      </div>
    </main>
  );
}