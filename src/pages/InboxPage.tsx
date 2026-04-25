import { useState } from 'react';
import { Inbox as InboxIcon, Check, Trash2, CheckSquare, FileText, GitBranch, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { CustomDialog } from '../components/ui/CustomDialog';

export function InboxPage() {
  const { inbox, approveInboxItem, removeFromInbox, setPendingOpen } = useAppStore();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  if (inbox.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div
          className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center mb-5"
          style={{
            boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <InboxIcon className="w-6 h-6 text-white/50" />
        </div>
        <h2 className="text-lg font-normal text-white mb-2 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          Inbox is zero
        </h2>
        <p className="text-sm text-white/40 font-light max-w-sm leading-relaxed mb-8">
          You're all caught up. Any unconfirmed or low-confidence AI extractions will appear here for your review.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setPendingOpen('task', 'new');
              navigate('/tasks');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-xl transition-all border border-white/[0.05]"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
          <button
            onClick={() => {
              setPendingOpen('note', 'new');
              navigate('/notes');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-xl transition-all border border-white/[0.05]"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </button>
          <button
            onClick={() => {
              setPendingOpen('decision', 'new');
              navigate('/decisions');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-xl transition-all border border-white/[0.05]"
          >
            <Plus className="w-4 h-4" />
            Log Decision
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto hide-scrollbar">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-normal text-white tracking-tight mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          Inbox
        </h1>
        <p className="text-sm text-white/40 font-light">{inbox.length} pending items to review</p>
      </div>

      <div className="flex flex-col gap-4 max-w-3xl">
        {inbox.map(({ id, type, item }) => (
          <div key={id} className="p-5 rounded-xl bg-[#1a1a1a] border border-white/[0.05] flex gap-4 items-start group hover:border-white/[0.1] transition-all">
            <div className="mt-1 shrink-0">
              {type === 'task' && <CheckSquare className="w-5 h-5 text-blue-400/70" />}
              {type === 'note' && <FileText className="w-5 h-5 text-emerald-400/70" />}
              {type === 'decision' && <GitBranch className="w-5 h-5 text-purple-400/70" />}
              {type === 'reflection' && <RefreshCw className="w-5 h-5 text-amber-400/70" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider text-amber-400/60 font-medium">Pending {type}</span>
              </div>
              <h4 className="text-sm text-white font-normal mb-1">{(item as any).title || (item as any).summary}</h4>
              <p className="text-xs text-white/50 font-light line-clamp-2">
                {(item as any).description || (item as any).content || (item as any).reasoning || (item as any).learnings?.join(', ')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={() => approveInboxItem(id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                title="Approve & Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setItemToDelete(id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/5 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
                title="Discard"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CustomDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            removeFromInbox(itemToDelete);
            setItemToDelete(null);
          }
        }}
        title="Discard Inbox Item"
        message="Are you sure you want to discard this item? It won't be saved to your OS."
        type="danger"
        confirmLabel="Discard"
        cancelLabel="Keep"
      />
    </div>
  );
}
