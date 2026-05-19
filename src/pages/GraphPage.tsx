import { useRef, useEffect, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useAppStore } from '../store';
import { GitBranch, FileText, CheckSquare, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function GraphPage() {
  const { tasks, notes, decisions } = useAppStore();
  const graphRef = useRef<any>(null);
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('graph-container');
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];

    // Add Tasks
    tasks.forEach(t => {
      nodes.push({ id: t.id, name: t.title, group: 'task', val: 1.5 });
      t.linkedTaskIds?.forEach(targetId => links.push({ source: t.id, target: targetId }));
      t.linkedNoteIds?.forEach(targetId => links.push({ source: t.id, target: targetId }));
      t.linkedDecisionIds?.forEach(targetId => links.push({ source: t.id, target: targetId }));
    });

    // Add Notes
    notes.forEach(n => {
      nodes.push({ id: n.id, name: n.title, group: 'note', val: 2 });
      n.linkedTaskIds?.forEach(targetId => links.push({ source: n.id, target: targetId }));
      n.linkedNoteIds?.forEach(targetId => links.push({ source: n.id, target: targetId }));
      n.linkedDecisionIds?.forEach(targetId => links.push({ source: n.id, target: targetId }));
    });

    // Add Decisions
    decisions.forEach(d => {
      nodes.push({ id: d.id, name: d.title, group: 'decision', val: 2.5 });
      d.linkedTaskIds?.forEach(targetId => links.push({ source: d.id, target: targetId }));
      d.linkedNoteIds?.forEach(targetId => links.push({ source: d.id, target: targetId }));
      d.linkedDecisionIds?.forEach(targetId => links.push({ source: d.id, target: targetId }));
    });

    // Filter out links pointing to non-existent nodes
    const nodeIds = new Set(nodes.map(n => n.id));
    const validLinks = links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

    return { nodes, links: validLinks };
  }, [tasks, notes, decisions]);

  const handleNodeClick = (node: any) => {
    if (node.group === 'task') navigate('/tasks');
    if (node.group === 'note') navigate('/notes');
    if (node.group === 'decision') navigate('/decisions');
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#050505]">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10 pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto">
          <h1 className="text-2xl font-normal text-white tracking-tight mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Knowledge Graph
          </h1>
          <p className="text-sm text-white/50 font-light">
            Visualizing {graphData.nodes.length} items and {graphData.links.length} connections.
          </p>
        </div>
        
        <div className="pointer-events-auto flex flex-col gap-2 bg-[#111]/80 backdrop-blur-md p-3 rounded-xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <CheckSquare className="w-3.5 h-3.5 text-blue-400" /> Tasks
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <FileText className="w-3.5 h-3.5 text-emerald-400" /> Notes
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <GitBranch className="w-3.5 h-3.5 text-purple-400" /> Decisions
          </div>
        </div>
      </div>

      {/* Graph controls */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2 pointer-events-auto">
        <button onClick={() => graphRef.current?.zoom(graphRef.current.zoom() * 1.2, 400)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
          <ZoomIn className="w-5 h-5 text-white/70" />
        </button>
        <button onClick={() => graphRef.current?.zoom(graphRef.current.zoom() / 1.2, 400)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors">
          <ZoomOut className="w-5 h-5 text-white/70" />
        </button>
        <button onClick={() => graphRef.current?.zoomToFit(400)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors mt-2">
          <Maximize className="w-5 h-5 text-white/70" />
        </button>
      </div>

      <div id="graph-container" className="flex-1 w-full h-full">
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            ref={graphRef}
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeLabel="name"
            nodeColor={(node: any) => {
              if (node.group === 'task') return '#60a5fa'; // blue-400
              if (node.group === 'note') return '#34d399'; // emerald-400
              if (node.group === 'decision') return '#c084fc'; // purple-400
              return '#ffffff';
            }}
            nodeRelSize={4}
            linkColor={() => 'rgba(255, 255, 255, 0.1)'}
            linkWidth={1.5}
            onNodeClick={handleNodeClick}
            backgroundColor="#050505"
            cooldownTicks={100}
            onEngineStop={() => graphRef.current?.zoomToFit(400, 50)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 font-light text-sm">
            No linked items to display in graph.
          </div>
        )}
      </div>
    </div>
  );
}
