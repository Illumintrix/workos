import { useState } from 'react';
import { Briefcase, Sparkles, Copy, Check, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
import { generatePortfolioBullet } from '../engine/aiEngine';
import { v4 as uuidv4 } from 'uuid';
import { CustomDialog } from '../components/ui/CustomDialog';

export function PortfolioPage() {
  const { tasks, decisions, portfolio, addPortfolioItem, projects } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Group completed tasks and decisions by project name
    const projectMap = new Map<string, { tasks: any[], decisions: any[], id: string | null }>();
    
    tasks.filter(t => t.status === 'completed' && t.projectId).forEach(t => {
      const project = projects.find(p => p.id === t.projectId);
      const pName = project?.name || 'Unknown Project';
      if (!projectMap.has(pName)) projectMap.set(pName, { tasks: [], decisions: [], id: t.projectId });
      projectMap.get(pName)!.tasks.push(t);
    });

    decisions.filter(d => d.projectId).forEach(d => {
      const project = projects.find(p => p.id === d.projectId);
      const pName = project?.name || 'Unknown Project';
      if (!projectMap.has(pName)) projectMap.set(pName, { tasks: [], decisions: [], id: d.projectId });
      projectMap.get(pName)!.decisions.push(d);
    });

    // Generate bullets for projects that have significant work
    let generatedCount = 0;
    
    if (projectMap.size === 0) {
      setShowAlert(true);
      setIsGenerating(false);
      return;
    }

    for (const [pName, data] of projectMap.entries()) {
      // Skip if we already have a portfolio item for this project name
      if (portfolio.some(p => p.title === pName)) continue;

      const contextText = `Project: ${pName}\nCompleted Tasks: ${data.tasks.map(t => t.title).join(', ')}\nKey Decisions: ${data.decisions.map(d => d.title + ' (Reasoning: ' + d.reasoning + ')').join(', ')}`;
      
      try {
        const bullet = await generatePortfolioBullet(contextText);
        
        await addPortfolioItem({
          id: uuidv4(),
          title: pName,
          impactDescription: `Completed ${data.tasks.length} tasks and made ${data.decisions.length} key decisions.`,
          timeframe: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          relatedTaskIds: data.tasks.map(t => t.id),
          relatedDecisionIds: data.decisions.map(d => d.id),
          resumeBullet: bullet,
          projectId: data.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        generatedCount++;
      } catch (e) {
        console.error('Failed to generate bullet for', pName, e);
      }
    }

    if (generatedCount === 0 && projectMap.size > 0) {
      // Meaning we had projects, but they were already generated
      // Or an error occurred.
      console.log("No new highlights generated.");
    }

    setIsGenerating(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto hide-scrollbar flex flex-col">
      {portfolio.length === 0 && !isGenerating ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div
            className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center mb-5"
            style={{
              boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Briefcase className="w-6 h-6 text-white/50" />
          </div>
          <h2 className="text-lg font-normal text-white mb-2 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Portfolio Engine
          </h2>
          <p className="text-sm text-white/40 font-light max-w-sm leading-relaxed mb-6">
            I can analyze your completed tasks and decisions to automatically generate professional resume bullets highlighting your impact.
          </p>
          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate Highlights
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-normal text-white tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                Portfolio
              </h1>
              <p className="text-sm text-white/40 font-light mt-1">Your career highlights, auto-generated.</p>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-[#2a2a2a] border border-white/10 text-white text-sm font-light hover:bg-[#333] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'Analyzing Work...' : 'Update Portfolio'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-5xl">
            {portfolio.map(item => (
              <div 
                key={item.id}
                className="flex flex-col p-5 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.05] transition-all hover:border-white/[0.1] relative group"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 8px 24px -8px rgba(0,0,0,0.5)' }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPortfolioToDelete(item.id);
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 z-10"
                  title="Delete highlight"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-start justify-between mb-4">
                  <div className="pr-10">
                    <h3 className="text-base text-white font-normal tracking-tight mb-1">{item.title}</h3>
                    <p className="text-xs text-white/40 font-light">{item.timeframe} • {item.impactDescription}</p>
                  </div>
                </div>
                
                <div className="mt-auto p-4 rounded-xl bg-[#050505] border border-white/[0.03] relative group">
                  <p className="text-sm text-emerald-100/80 font-light leading-relaxed pr-8">
                    "{item.resumeBullet}"
                  </p>
                  
                  <button
                    onClick={() => handleCopy(item.id, item.resumeBullet)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy to clipboard"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <CustomDialog
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="No Project Data Found"
        message="I couldn't find any completed tasks or decisions associated with a project. Please complete some work and assign it to a project first!"
        type="warning"
      />

      <CustomDialog
        isOpen={!!portfolioToDelete}
        onClose={() => setPortfolioToDelete(null)}
        onConfirm={() => {
          if (portfolioToDelete) {
            useAppStore.getState().deletePortfolioItem(portfolioToDelete);
            setPortfolioToDelete(null);
          }
        }}
        title="Delete Highlight"
        message="Are you sure you want to permanently delete this portfolio highlight? This action cannot be undone."
        type="danger"
        confirmLabel="Delete Permanent"
        cancelLabel="Cancel"
      />
    </div>
  );
}
