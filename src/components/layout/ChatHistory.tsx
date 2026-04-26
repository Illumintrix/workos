import { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronRight, Settings, Check } from 'lucide-react';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { CustomDialog } from '../ui/CustomDialog';

interface ChatHistoryProps {
  isCollapsed: boolean;
}

export function ChatHistory({ isCollapsed }: ChatHistoryProps) {
  const { 
    conversations, 
    selectedConversationId, 
    addConversation,
    deleteConversation,
    chatSortOrder,
    setChatSortOrder,
    setChatBrowserOpen
  } = useAppStore();
  
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleNewChat = async () => {
    await addConversation('Untitled Chat');
    const newId = useAppStore.getState().selectedConversationId;
    if (newId) {
      navigate(`/chat/${newId}`);
    }
  };

  if (isCollapsed) return null;

  return (
    <div className="flex flex-col py-4 border-t border-white/[0.04]">
      <div className="flex items-center justify-between px-3 mb-1 group relative">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] hover:text-white/40 transition-colors"
        >
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          Chats
        </button>
        
        <div className="flex items-center gap-1">
          {isExpanded && (
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`p-1 rounded-md transition-colors ${isSortOpen ? 'text-white bg-white/10' : 'text-white/10 hover:text-white/30'}`}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.9)] z-50 overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => {
                        setChatSortOrder('recently_updated');
                        setIsSortOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-all group/item ${chatSortOrder === 'recently_updated' ? 'bg-white/5 text-white' : 'text-white/60 hover:text-white hover:bg-white/[0.03] font-light'}`}
                    >
                      Recently updated
                      {chatSortOrder === 'recently_updated' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                    <button
                      onClick={() => {
                        setChatSortOrder('recently_created');
                        setIsSortOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-all group/item ${chatSortOrder === 'recently_created' ? 'bg-white/5 text-white' : 'text-white/60 hover:text-white hover:bg-white/[0.03] font-light'}`}
                    >
                      Recently created
                      {chatSortOrder === 'recently_created' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          
          <button 
            onClick={handleNewChat}
            className="p-1 text-white/20 hover:text-white/50 transition-colors opacity-0 group-hover:opacity-100"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-0.5 px-2">
          {conversations.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-[11px] text-white/10 font-light italic">No previous chats</p>
            </div>
          ) : (
            <>
              {conversations
                .sort((a, b) => {
                  if (chatSortOrder === 'recently_updated') {
                    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
                  }
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .slice(0, 6)
                .map((conv) => {
                  const isActive = selectedConversationId === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => navigate(`/chat/${conv.id}`)}
                      className={`
                        group flex items-center gap-3 px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/[0.05]' 
                          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'}
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm truncate tracking-tight ${isActive ? 'font-medium' : 'font-light'}`}>
                          {conv.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              
              {conversations.length > 6 && (
                <button
                  onClick={() => setChatBrowserOpen(true)}
                  className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/20 hover:text-white/50 hover:bg-white/[0.03] transition-all border border-transparent"
                >
                  <span className="text-sm tracking-tight font-light">
                    ... All chats
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      )}

      <CustomDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteConversation(deleteId)}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        type="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
