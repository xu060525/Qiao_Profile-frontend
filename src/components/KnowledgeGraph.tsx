"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface GraphData {
  nodes: any[];
  links: any[];
}

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export default function KnowledgeGraph() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    fetch("http://localhost:8000/api/v1/graph/")
      .then((res) => res.json())
      .then((data: GraphData) => setGraphData(data))
      .catch((err) => console.error(err));
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      {graphData.nodes.length > 0 ? (
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeColor={() => "#f97316"}
          linkColor={() => "#525252"}
          nodeRelSize={6}
          linkWidth={(link: any) => link.value * 8}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
        />
      ) : (
        <div className="text-neutral-500 font-medium">
          图谱孕育中... (需至少两篇笔记)
        </div>
      )}
    </div>
  );
}