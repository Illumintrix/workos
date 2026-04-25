import { useAppStore } from '../../store';
import { X, CheckSquare, FileText, GitBranch, Sparkles } from 'lucide-react';
import type { Task, Note, Decision } from '../../store/types';

function MiniTaskCard({ task }: { task: Task }) {
  const priorityColors = {
    high: { bg: 'from-[#3a1d1d] to-[#241010]', text: 'text-[#ff8a8a]', border: 'border-[#522525]' },
    medium: { bg: 'from-[#3a3a1d] to-[#242410]', text: 'text-[#ffd98a]', border: 'border-[#525225]' },
    low: { bg: 'from-[#1d3a24] to-[#102415]', text: 'text-[#8affb1]', border: 'border-[#2b5936]' },
  };
  const p = priorityColors[task.priority];

  return (
    <div
      className="p-4 rounded-xl bg-gradient-to-b from-[#1e1e1e] to-[#141414] border border-white/[0.05] animate-in slide-in-from-right-4 duration-500"
      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <CheckSquare className="w-3.5 h-3.5 text-blue-400/70" />
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-light">Task Created</span>
      </div>
      <h4 className="text-sm text-white font-normal tracking-tight mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
        {task.title}
      </h4>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded text-[10px] font-normal tracking-wide border bg-gradient-to-b ${p.bg} ${p.text} ${p.border}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-[10px] text-white/50 font-light">
            Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
        {task.projectId && (
          <span className="text-[10px] text-white/40 font-light px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.05]">
            {useAppStore.getState().projects.find(p => p.id === task.projectId)?.name || 'Project'}
          </span>
        )}
      </div>
    </div>
  );
}

function MiniNoteCard({ note }: { note: Note }) {
  return (
    <div
      className="p-4 rounded-xl bg-gradient-to-b from-[#1e1e1e] to-[#141414] border border-white/[0.05] animate-in slide-in-from-right-4 duration-500"
      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)', animationDelay: '100ms' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-3.5 h-3.5 text-emerald-400/70" />
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-light">Note Created</span>
      </div>
      <h4 className="text-sm text-white font-normal tracking-tight mb-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
        {note.title}
      </h4>
      <p className="text-xs text-white/40 font-light line-clamp-2 leading-relaxed">{note.content}</p>
      <div className="mt-2">
        <span className="text-[10px] text-white/40 font-light px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.05]">
          {note.category}
        </span>
      </div>
    </div>
  );
}

function MiniDecisionCard({ decision }: { decision: Decision }) {
  return (
    <div
      className="p-4 rounded-xl bg-gradient-to-b from-[#1e1e1e] to-[#141414] border-l-2 border-l-purple-500/50 border border-white/[0.05] animate-in slide-in-from-right-4 duration-500"
      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)', animationDelay: '200ms' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-3.5 h-3.5 text-purple-400/70" />
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-light">Decision Logged</span>
      </div>
      <h4 className="text-sm text-white font-normal tracking-tight mb-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
        {decision.title}
      </h4>
      <p className="text-xs text-white/40 font-light line-clamp-2 leading-relaxed">{decision.reasoning}</p>
    </div>
  );
}

export function RightPanel() {
  const { rightPanelContent, isRightPanelOpen, toggleRightPanel } = useAppStore();

  if (!isRightPanelOpen || !rightPanelContent) return null;

  const hasTasks = rightPanelContent.tasks.length > 0;
  const hasNotes = rightPanelContent.notes.length > 0;
  const hasDecisions = rightPanelContent.decisions.length > 0;
  const totalItems =
    rightPanelContent.tasks.length +
    rightPanelContent.notes.length +
    rightPanelContent.decisions.length +
    rightPanelContent.reflections.length;

  return (
    <aside
      className="
        w-[320px] h-screen shrink-0
        bg-[#0a0a0a]/95 backdrop-blur-xl
        border-l border-white/[0.04]
        flex flex-col
        overflow-hidden
        animate-in slide-in-from-right duration-300
      "
      style={{ boxShadow: '-1px 0 20px rgba(0,0,0,0.5)' }}
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
      <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400/70" />
          <span className="text-sm font-normal text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            AI Output
          </span>
          <span className="text-[10px] text-white/40 font-light px-1.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.05]">
            {totalItems}
          </span>
        </div>
        <button
          onClick={() => toggleRightPanel(false)}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto hide-scrollbar p-4 flex flex-col gap-3">
        {hasTasks && rightPanelContent.tasks.map((task) => (
          <MiniTaskCard key={task.id} task={task} />
        ))}
        {hasNotes && rightPanelContent.notes.map((note) => (
          <MiniNoteCard key={note.id} note={note} />
        ))}
        {hasDecisions && rightPanelContent.decisions.map((decision) => (
          <MiniDecisionCard key={decision.id} decision={decision} />
        ))}
      </div>
    </aside>
  );
}
