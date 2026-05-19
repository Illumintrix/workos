import { useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, CheckSquare, Settings, Zap, ArrowRight, GitBranch } from 'lucide-react';
import { useAppStore } from '../../store';

export function CommandPalette() {
  const navigate = useNavigate();
  const { tasks, notes, isSearchModalOpen, setSearchModalOpen } = useAppStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setSearchModalOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isSearchModalOpen, setSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 relative"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.06)',
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />

        <Command label="Command Menu" className="w-full relative z-10">
          <div className="flex items-center px-5 border-b border-white/[0.06] bg-black/20">
            <Search className="w-5 h-5 text-white/30 mr-3 shrink-0" />
            <Command.Input 
              placeholder="Type a command or search..." 
              autoFocus
              className="w-full bg-transparent text-white text-base py-4 focus:outline-none placeholder:text-white/20 font-light"
            />
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2.5 hide-scrollbar">
            <Command.Empty className="py-8 text-center text-sm text-white/30 font-light">
              No results found.
            </Command.Empty>

            <Command.Group 
              heading={<span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 block px-2.5 py-1.5">Navigation</span>}
            >
              <Command.Item
                onSelect={() => { navigate('/today'); setSearchModalOpen(false); }}
                className="flex items-center px-3.5 py-2.5 mt-0.5 text-sm text-white/60 font-light rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-all duration-150"
              >
                <Zap className="w-4 h-4 mr-3 text-amber-400/80" />
                <span className="flex-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Go to Today</span>
                <span className="text-[10px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">G T</span>
              </Command.Item>
              <Command.Item
                onSelect={() => { navigate('/tasks'); setSearchModalOpen(false); }}
                className="flex items-center px-3.5 py-2.5 mt-0.5 text-sm text-white/60 font-light rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-all duration-150"
              >
                <CheckSquare className="w-4 h-4 mr-3 text-blue-400/80" />
                <span className="flex-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Go to Tasks</span>
                <span className="text-[10px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">G K</span>
              </Command.Item>
              <Command.Item
                onSelect={() => { navigate('/notes'); setSearchModalOpen(false); }}
                className="flex items-center px-3.5 py-2.5 mt-0.5 text-sm text-white/60 font-light rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-all duration-150"
              >
                <FileText className="w-4 h-4 mr-3 text-emerald-400/80" />
                <span className="flex-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Go to Notes</span>
                <span className="text-[10px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">G N</span>
              </Command.Item>
              <Command.Item
                onSelect={() => { navigate('/graph'); setSearchModalOpen(false); }}
                className="flex items-center px-3.5 py-2.5 mt-0.5 text-sm text-white/60 font-light rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-all duration-150"
              >
                <GitBranch className="w-4 h-4 mr-3 text-purple-400/80" />
                <span className="flex-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Knowledge Graph</span>
                <span className="text-[10px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">G G</span>
              </Command.Item>
            </Command.Group>

            {tasks.length > 0 && (
              <Command.Group 
                heading={<span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 block px-2.5 py-1.5 mt-2 border-t border-white/[0.04] pt-3">Recent Tasks</span>}
              >
                {tasks.slice(0, 3).map(task => (
                  <Command.Item
                    key={task.id}
                    onSelect={() => { navigate('/tasks'); setSearchModalOpen(false); }}
                    className="flex items-center px-3.5 py-2.5 mt-0.5 text-sm text-white/60 font-light rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-all duration-150"
                  >
                    <CheckSquare className="w-4 h-4 mr-3 text-blue-400/40 shrink-0" />
                    <span className="truncate flex-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{task.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/20 ml-2 shrink-0" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {notes.length > 0 && (
              <Command.Group 
                heading={<span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 block px-2.5 py-1.5 mt-2 border-t border-white/[0.04] pt-3">Recent Notes</span>}
              >
                {notes.slice(0, 3).map(note => (
                  <Command.Item
                    key={note.id}
                    onSelect={() => { navigate('/notes'); setSearchModalOpen(false); }}
                    className="flex items-center px-3.5 py-2.5 mt-0.5 text-sm text-white/60 font-light rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-all duration-150"
                  >
                    <FileText className="w-4 h-4 mr-3 text-emerald-400/40 shrink-0" />
                    <span className="truncate flex-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{note.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/20 ml-2 shrink-0" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            
            <Command.Group 
              heading={<span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 block px-2.5 py-1.5 mt-2 border-t border-white/[0.04] pt-3">Settings</span>}
            >
              <Command.Item
                onSelect={() => { 
                  useAppStore.setState({ isSettingsOpen: true }); 
                  setSearchModalOpen(false); 
                }}
                className="flex items-center px-3.5 py-2.5 mt-0.5 text-sm text-white/60 font-light rounded-xl cursor-pointer aria-selected:bg-white/5 aria-selected:text-white transition-all duration-150"
              >
                <Settings className="w-4 h-4 mr-3 text-white/40" />
                <span className="flex-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Open Settings</span>
                <span className="text-[10px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">⌘ ,</span>
              </Command.Item>
            </Command.Group>

          </Command.List>
        </Command>
      </div>
      <div className="absolute inset-0 z-[-1]" onClick={() => setSearchModalOpen(false)} />
    </div>
  );
}
