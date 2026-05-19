import { useState } from 'react';
import { Search as SearchIcon, Loader2, CheckSquare, FileText, GitBranch, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store';
import { performSemanticSearch } from '../engine/aiEngine';
import { supabase } from '../lib/supabase';

export function SearchPage() {
  const { tasks, notes, decisions, reflections } = useAppStore();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ id: string; type: string; item: any }[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);

    const contextData = [
      ...tasks.map(t => ({ id: t.id, type: 'task', title: t.title, text: t.description || '' })),
      ...notes.map(n => ({ id: n.id, type: 'note', title: n.title, text: n.content || '' })),
      ...decisions.map(d => ({ id: d.id, type: 'decision', title: d.title, text: d.reasoning || '' })),
      ...reflections.map(r => ({ id: r.id, type: 'reflection', title: r.summary, text: r.learnings?.join(', ') || '' }))
    ];

    try {
      let found: { id: string; type: string; item: any }[] = [];
      const user = useAppStore.getState().user;
      const apiKey = useAppStore.getState().settings.openaiApiKey;

      if (user && apiKey) {
        // Generate embedding for query
        const res = await fetch('/api/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: query, apiKey })
        });
        
        if (res.ok) {
          const { embedding } = await res.json();
          // Call Supabase RPC
          const { data, error } = await supabase.rpc('search_workspace', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: 20,
            user_id_param: user.id
          });
          
          if (!error && data) {
            data.forEach((match: any) => {
              if (match.type === 'task') {
                const item = tasks.find(t => t.id === match.id);
                if (item) found.push({ id: match.id, type: 'task', item });
              } else if (match.type === 'note') {
                const item = notes.find(n => n.id === match.id);
                if (item) found.push({ id: match.id, type: 'note', item });
              } else if (match.type === 'decision') {
                const item = decisions.find(d => d.id === match.id);
                if (item) found.push({ id: match.id, type: 'decision', item });
              }
            });
          }
        }
      }

      // Fallback to LLM semantic search if pgvector didn't run or found nothing
      if (found.length === 0) {
        const matchedIds = await performSemanticSearch(query, contextData);
        
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
      }

      setResults(found);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col items-center overflow-y-auto hide-scrollbar">
      <div className={`w-full max-w-3xl transition-all duration-500 flex flex-col ${results === null && !isSearching ? 'justify-center flex-1' : 'mt-8'}`}>
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center mb-5"
            style={{
              boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <SearchIcon className="w-6 h-6 text-white/50" />
          </div>
          <h1 className="text-2xl font-normal text-white tracking-tight mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Search your workspace
          </h1>
          <p className="text-sm text-white/40 font-light">Search by meaning, not just keywords.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full mb-10">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-white/30" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              if (!val.trim()) {
                setResults(null);
              }
            }}
            placeholder="e.g. 'thoughts on pricing' or 'why did we drop the login feature'"
            className="w-full bg-[#1a1a1a] border border-white/[0.05] text-white text-base rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-white/20 shadow-inner"
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-5 py-2.5 bg-white text-black hover:bg-white/90 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : 'Search'}
            </button>
          </div>
        </form>

        {results !== null && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-white/[0.02] rounded-3xl bg-[#111]/50">
                 <p className="text-sm text-white/50 font-light">No matches found for "{query}".</p>
                 <p className="text-xs text-white/30 font-light mt-2">Try rephrasing your search conceptually.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                 <p className="text-xs text-white/40 font-light mb-2">{results.length} results found</p>
                 {results.map(({ id, type, item }) => (
                   <div key={id} className="p-5 rounded-2xl bg-gradient-to-b from-[#1e1e1e] to-[#141414] border border-white/[0.05] flex gap-4 hover:border-white/[0.1] transition-all group cursor-pointer" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)' }}>
                     <div className="mt-1 shrink-0">
                       {type === 'task' && <CheckSquare className="w-5 h-5 text-blue-400/70" />}
                       {type === 'note' && <FileText className="w-5 h-5 text-emerald-400/70" />}
                       {type === 'decision' && <GitBranch className="w-5 h-5 text-purple-400/70" />}
                       {type === 'reflection' && <RefreshCw className="w-5 h-5 text-amber-400/70" />}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1.5">
                         <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">{type}</span>
                         {item.project && <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 truncate">{item.project}</span>}
                       </div>
                       <h4 className="text-base text-white font-normal tracking-tight mb-1.5 group-hover:text-white/90 transition-colors truncate">{item.title || item.summary}</h4>
                       <p className="text-sm text-white/50 font-light line-clamp-2 leading-relaxed">
                         {item.description || item.content || item.reasoning || item.learnings?.join(', ')}
                       </p>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
