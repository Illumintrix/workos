import { useState, useEffect } from 'react';
import { Search, Loader2, CheckSquare, FileText, GitBranch, X, Hash } from 'lucide-react';
import { useAppStore } from '../../store';

interface LinkRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLink: (id: string, type: string) => void;
  excludeIds?: string[];
}

export function LinkRecordModal({ isOpen, onClose, onLink, excludeIds = [] }: LinkRecordModalProps) {
  const { tasks, notes, decisions } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; type: string; title: string; subtitle: string }[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    } else {
      // Initial state: show recent or all
      handleSearch('');
    }
  }, [isOpen]);

  const handleSearch = (val: string) => {
    setQuery(val);
    const lowerVal = val.toLowerCase();

    const allItems = [
      ...tasks.map(t => ({ id: t.id, type: 'task', title: t.title, subtitle: t.status })),
      ...notes.map(n => ({ id: n.id, type: 'note', title: n.title, subtitle: n.category })),
      ...decisions.map(d => ({ id: d.id, type: 'decision', title: d.title, subtitle: 'Decision' }))
    ].filter(item => !excludeIds.includes(item.id));

    if (!val.trim()) {
      setResults(allItems.slice(0, 10)); // Show top 10 if no query
      return;
    }

    const filtered = allItems.filter(item => 
      item.title.toLowerCase().includes(lowerVal) || 
      item.type.toLowerCase().includes(lowerVal)
    );

    setResults(filtered);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-white/[0.05] flex items-center gap-3">
          <Search className="w-4 h-4 text-white/30" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search records to link..."
            className="flex-1 bg-transparent border-none text-white text-sm py-1 focus:outline-none focus:ring-0 placeholder:text-white/10"
          />
          <button 
            onClick={onClose}
            className="p-1 text-white/20 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-2 hide-scrollbar">
          {results.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-white/20 font-light">No records found</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onLink(item.id, item.type);
                    onClose();
                  }}
                  className="px-6 py-3 flex items-center gap-4 hover:bg-white/[0.03] transition-all text-left border-b border-white/[0.02] last:border-0 group"
                >
                  <div className="shrink-0">
                    {item.type === 'task' && <CheckSquare className="w-4 h-4 text-blue-400/50" />}
                    {item.type === 'note' && <FileText className="w-4 h-4 text-emerald-400/50" />}
                    {item.type === 'decision' && <GitBranch className="w-4 h-4 text-purple-400/50" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-white/80 font-normal group-hover:text-white transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest font-medium mt-0.5">
                      {item.type} • {item.subtitle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
