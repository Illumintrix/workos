import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, FileText, GitBranch, Plus } from 'lucide-react';
import { useAppStore } from '../../store';
import { LinkRecordModal } from '../ui/LinkRecordModal';

interface RelatedContextProps {
  currentId: string;
  currentType: 'task' | 'note' | 'decision';
  linkedTaskIds?: string[];
  linkedNoteIds?: string[];
  linkedDecisionIds?: string[];
  onLink: (id: string, type: string) => void;
}

export function RelatedContext({ 
  currentId, 
  currentType, 
  linkedTaskIds = [], 
  linkedNoteIds = [], 
  linkedDecisionIds = [],
  onLink
}: RelatedContextProps) {
  const { tasks, notes, decisions, setPendingOpen } = useAppStore();
  const navigate = useNavigate();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Get all unique linked items (checking both directions)
  const relatedTasks = tasks.filter(t => 
    t.id !== currentId && (
      linkedTaskIds.includes(t.id) || 
      (currentType === 'task' && t.linkedTaskIds?.includes(currentId)) ||
      (currentType === 'note' && t.linkedNoteIds?.includes(currentId)) ||
      (currentType === 'decision' && t.linkedDecisionIds?.includes(currentId))
    )
  );

  const relatedNotes = notes.filter(n => 
    n.id !== currentId && (
      linkedNoteIds.includes(n.id) || 
      (currentType === 'task' && n.linkedTaskIds?.includes(currentId)) ||
      (currentType === 'note' && n.linkedNoteIds?.includes(currentId)) ||
      (currentType === 'decision' && n.linkedDecisionIds?.includes(currentId))
    )
  );

  const relatedDecisions = decisions.filter(d => 
    d.id !== currentId && (
      linkedDecisionIds.includes(d.id) || 
      (currentType === 'task' && d.linkedTaskIds?.includes(currentId)) ||
      (currentType === 'note' && d.linkedNoteIds?.includes(currentId)) ||
      (currentType === 'decision' && d.linkedDecisionIds?.includes(currentId))
    )
  );

  const hasLinks = relatedTasks.length > 0 || relatedNotes.length > 0 || relatedDecisions.length > 0;

  return (
    <div className="border-t border-white/[0.05] pt-5 mt-2">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">Related Context</span>
        <button
          onClick={() => setIsLinkModalOpen(true)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/10 transition-all text-[10px] font-medium"
        >
          <Plus className="w-3 h-3" />
          Link Record
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {relatedTasks.map(task => (
          <div 
            key={task.id}
            onClick={() => {
              setPendingOpen('task', task.id);
              navigate('/tasks');
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] transition-colors cursor-pointer group"
          >
            <CheckSquare className="w-3.5 h-3.5 text-blue-400/50" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-white/70 font-normal truncate">{task.title}</div>
              <div className="text-[9px] text-white/20 truncate uppercase tracking-tighter">Task • {task.status}</div>
            </div>
          </div>
        ))}

        {relatedNotes.map(note => (
          <div 
            key={note.id}
            onClick={() => {
              setPendingOpen('note', note.id);
              navigate('/notes');
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] transition-colors cursor-pointer group"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400/50" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-white/70 font-normal truncate">{note.title}</div>
              <div className="text-[9px] text-white/20 truncate uppercase tracking-tighter">Note • {note.category}</div>
            </div>
          </div>
        ))}

        {relatedDecisions.map(decision => (
          <div 
            key={decision.id}
            onClick={() => {
              setPendingOpen('decision', decision.id);
              navigate('/decisions');
            }}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] transition-colors cursor-pointer group"
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-400/50" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-white/70 font-normal truncate">{decision.title}</div>
              <div className="text-[9px] text-white/20 truncate uppercase tracking-tighter">Decision</div>
            </div>
          </div>
        ))}

        {!hasLinks && (
          <p className="text-[11px] text-white/10 italic font-light py-2">No linked items yet.</p>
        )}
      </div>

      <LinkRecordModal 
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onLink={onLink}
        excludeIds={[currentId]}
      />
    </div>
  );
}
