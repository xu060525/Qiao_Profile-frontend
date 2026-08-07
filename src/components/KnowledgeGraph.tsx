"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 定义 TypeScript 接口，防止数据类型报错
interface GraphData {
  nodes: any[];
  links: any[];
}

// 动态导入力导向图库并关闭 SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function KnowledgeGraph() {
  // 2. 注入刚才定义的类型 <GraphData>
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  // 3. 增加一个挂载状态，完美解决 Next.js 偶尔会出现的 Hydration（水合）报错
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch('http://localhost:8000/api/v1/graph/')
      .then(res => res.json())
      .then(data => setGraphData(data))
      .catch(err => console.error("图谱数据拉取失败:", err));
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-[600px] border border-gray-800 rounded-xl overflow-hidden bg-black/50 backdrop-blur-sm">
      {graphData.nodes.length > 0 ? (
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeColor={() => '#3b82f6'}
          linkColor={() => '#4b5563'}
          nodeRelSize={6}
          linkWidth={(link: any) => link.value * 8}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          星空正在孕育中... (请确保后端有两篇以上的笔记)
        </div>
      )}
    </div>
  );
}