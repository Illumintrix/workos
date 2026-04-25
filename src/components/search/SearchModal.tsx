import { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2, CheckSquare, FileText, GitBranch, RefreshCw, X, Hash } from 'lucide-react';
import { useAppStore } from '../../store';
import { performSemanticSearch } from '../../engine/aiEngine';
import { useNavigate } from 'react-router-dom';

export function SearchModal() {
  const { 
    isSearchModalOpen, 
    setSearchModalOpen, 
    tasks, 
    notes, 
    decisions, 
    reflections,
    setPendingOpen 
  } = useAppStore();
  
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ id: string; type: string; item: any }[] | null>(null);

  useEffect(() => {
    if (!isSearchModalOpen) {
      setQuery('');
      setResults(null);
    }
  }, [isSearchModalOpen]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults(null);
      return;
    }

    setIsSearching(true);

    const contextData = [
      ...tasks.map(t => ({ id: t.id, type: 'task', title: t.title, text: t.description || '' })),
      ...notes.map(n => ({ id: n.id, type: 'note', title: n.title, text: n.content || '' })),
      ...decisions.map(d => ({ id: d.id, type: 'decision', title: d.title, text: d.reasoning || '' })),
      ...reflections.map(r => ({ id: r.id, type: 'reflection', title: r.summary, text: r.learnings?.join(', ') || '' }))
    ];

    try {
      const matchedIds = await performSemanticSearch(val, contextData);
      
      const found: { id: string; type: string; item: any }[] = [];
      
      matchedIds.forEach(id => {
        const task = tasks.find(t => t.id === id);
        if (task) found.push({ id, type: 'task', item: task });
        
        const note = notes.find(n => n.id === id);
        if (note) found.push({ id, type: 'note', item: note });
        
        const decision = decisions.find(d => d.id === id);
        if (decision) found.push({ id, type: 'decision', item: decision });

        const reflection = reflections.find(r => r.id === id);
        if (reflection) found.push({ id, type: 'reflection', item: reflection });
      });

      setResults(found);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (id: string, type: string) => {
    setSearchModalOpen(false);
    if (type === 'task') {
      setPendingOpen('task', id);
      navigate('/tasks');
    } else if (type === 'note') {
      setPendingOpen('note', id);
      navigate('/notes');
    } else if (type === 'decision') {
      setPendingOpen('decision', id);
      navigate('/decisions');
    } else if (type === 'reflection') {
      setPendingOpen('reflection', id);
      navigate('/reflections');
    }
  };

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setSearchModalOpen(false)}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/10 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="p-2 border-b border-white/[0.05] flex items-center gap-3">
          <div className="pl-4">
            {isSearching ? <Loader2 className="w-5 h-5 text-white/30 animate-spin" /> : <SearchIcon className="w-5 h-5 text-white/30" />}
          </div>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks, notes, decisions..."
            className="flex-1 bg-transparent border-none text-white text-lg py-4 focus:outline-none focus:ring-0 placeholder:text-white/10"
          />
          <button 
            onClick={() => setSearchModalOpen(false)}
            className="p-3 text-white/20 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">
          {!query.trim() ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-white/20 font-light">Search your entire workspace semantically.</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Try</span>
                    <span className="text-xs text-white/60">"project pricing"</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-medium">Try</span>
                    <span className="text-xs text-white/60">"overdue tasks"</span>
                 </div>
              </div>
            </div>
          ) : results?.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-white/40">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {results?.map(({ id, type, item }) => (
                <div
                  key={id}
                  onClick={() => handleSelect(id, type)}
                  className="px-6 py-4 flex gap-4 hover:bg-white/[0.03] transition-all cursor-pointer border-b border-white/[0.02] last:border-0 group"
                >
                  <div className="mt-1 shrink-0">
                    {type === 'task' && <CheckSquare className="w-4 h-4 text-blue-400/50" />}
                    {type === 'note' && <FileText className="w-4 h-4 text-emerald-400/50" />}
                    {type === 'decision' && <GitBranch className="w-4 h-4 text-purple-400/50" />}
                    {type === 'reflection' && <RefreshCw className="w-4 h-4 text-amber-400/50" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-white/20 font-medium">{type}</span>
                      {item.projectId && (
                        <div className="flex items-center gap-1 text-[10px] text-white/10">
                          <Hash className="w-2.5 h-2.5" />
                          <span>Project</span>
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm text-white/80 font-normal group-hover:text-white transition-colors truncate">
                      {item.title || item.summary}
                    </h4>
                    <p className="text-xs text-white/30 font-light line-clamp-1 mt-0.5">
                      {item.description || item.content || item.reasoning || item.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="px-6 py-3 bg-[#111]/50 border-t border-white/[0.05] flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-1 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 font-mono">↵</span>
                <span className="text-[10px] text-white/30 font-light">to select</span>
             </div>
             <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-1 py-0.5 rounded bg-white/5 border border-white/10 text-white/40 font-mono">esc</span>
                <span className="text-[10px] text-white/30 font-light">to close</span>
             </div>
           </div>
           <span className="text-[10px] text-white/20 italic font-light">Powered by Semantic Engine</span>
        </div>
      </div>
    </div>
  );
}
