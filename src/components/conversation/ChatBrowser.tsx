import { useState, useEffect, useRef } from 'react';
import { Search, X, Hash, Check, Filter, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export function ChatBrowser() {
  const { 
    isChatBrowserOpen, 
    setChatBrowserOpen, 
    conversations, 
    projects,
    chatSortOrder,
    selectedConversationId
  } = useAppStore();
  
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (isChatBrowserOpen) {
      setSearchQuery('');
      setSelectedProjectId(null);

      const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
          // Check if the click was on the "All chats" button in the sidebar to prevent double-toggle
          const isAllChatsButton = (event.target as HTMLElement).closest('button')?.textContent?.includes('All chats');
          if (!isAllChatsButton) {
            setChatBrowserOpen(false);
          }
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isChatBrowserOpen, setChatBrowserOpen]);

  if (!isChatBrowserOpen) return null;

  // Filter and Sort Logic
  const filteredConversations = conversations
    .filter(conv => {
      const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (chatSortOrder === 'recently_updated') {
        return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div 
      ref={panelRef}
      className="w-[320px] h-full flex flex-col bg-[#0e0e0e] border-r border-white/[0.08] animate-in slide-in-from-left duration-500 relative z-40"
      style={{ boxShadow: '1px 0 20px rgba(0,0,0,0.3)' }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 h-[60px] px-5 border-b border-white/[0.04] flex items-center justify-between">
        <h2 className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em]">All Chats</h2>
      </div>

      {/* Toolbar */}
      <div className="relative z-30 px-4 py-6 flex flex-col gap-4 border-b border-white/[0.02]">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 group-focus-within:text-white/60 transition-colors" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/10 transition-all font-light"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all text-[11px] font-light
              ${selectedProjectId || isFilterOpen ? 'bg-white/5 border-white/10 text-white' : 'bg-white/[0.01] border-white/[0.03] text-white/50 hover:text-white/70'}
            `}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3 opacity-60" />
              <span className="truncate">{selectedProjectId ? projects.find(p => p.id === selectedProjectId)?.name : 'Filter by Project'}</span>
            </div>
            <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <div 
                  className="absolute left-0 right-0 top-full mt-2 bg-[#000000] border border-white/[0.1] rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.9)' }}
                >
                <button
                  onClick={() => {
                    setSelectedProjectId(null);
                    setIsFilterOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-light text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  All Projects
                  {!selectedProjectId && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setIsFilterOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-light text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className="w-3 h-3 opacity-40" />
                      <span className="truncate">{project.name}</span>
                    </div>
                    {selectedProjectId === project.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* List area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-2 py-4 hide-scrollbar flex flex-col gap-1">
        {filteredConversations.length === 0 ? (
          <div className="mt-10 px-6 text-center opacity-20">
            <p className="text-[11px] font-light italic text-white/40 uppercase tracking-widest">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = selectedConversationId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => {
                  navigate(`/chat/${conv.id}`);
                  setChatBrowserOpen(false);
                }}
                className={`
                  group flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-200 text-left border
                  ${isActive 
                    ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                    : 'bg-transparent border-transparent hover:bg-white/[0.03] hover:border-transparent'}
                `}
              >
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm tracking-tight truncate transition-colors ${isActive ? 'text-white font-medium' : 'text-white/40 font-light group-hover:text-white/70'}`}>
                    {conv.title}
                  </h3>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
