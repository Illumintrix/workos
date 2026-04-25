import { useState } from 'react';
import { Clock, CheckSquare, FileText, GitBranch, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store';
import type { TimelineEvent } from '../store/types';
import { format } from 'date-fns';

const typeConfig = {
  task: { icon: CheckSquare, color: 'text-blue-400/70', bg: 'bg-blue-400/10', border: 'border-blue-400/20', label: 'Task' },
  note: { icon: FileText, color: 'text-emerald-400/70', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', label: 'Note' },
  decision: { icon: GitBranch, color: 'text-purple-400/70', bg: 'bg-purple-400/10', border: 'border-purple-400/20', label: 'Decision' },
  reflection: { icon: RefreshCw, color: 'text-amber-400/70', bg: 'bg-amber-400/10', border: 'border-amber-400/20', label: 'Reflection' },
};

function TimelineItem({ event }: { event: TimelineEvent }) {
  const config = typeConfig[event.type];
  const Icon = config.icon;

  return (
    <div className="flex gap-4 items-start group">
      <div className={`w-8 h-8 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/70 font-light">{event.summary}</p>
        <span className="text-[10px] text-white/30 font-light">
          {format(new Date(event.timestamp), 'h:mm a')}
        </span>
      </div>
    </div>
  );
}

export function TimelinePage() {
  const { timeline } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'task' | 'note' | 'decision' | 'reflection'>('all');

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div
          className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center mb-5"
          style={{
            boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Clock className="w-6 h-6 text-white/50" />
        </div>
        <h2 className="text-lg font-normal text-white mb-2 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          Your work history starts now
        </h2>
        <p className="text-sm text-white/40 font-light max-w-sm leading-relaxed">
          Everything you do will be remembered here. Start a conversation to begin building your timeline.
        </p>
      </div>
    );
  }

  const filteredTimeline = filter === 'all' ? timeline : timeline.filter(t => t.type === filter);

  // Group events by day
  const grouped = [...filteredTimeline].reverse().reduce((acc, event) => {
    const day = format(new Date(event.timestamp), 'EEEE, MMMM d, yyyy');
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const filters = [
    { id: 'all', label: 'All Activity' },
    { id: 'task', label: 'Tasks' },
    { id: 'note', label: 'Notes' },
    { id: 'decision', label: 'Decisions' },
    { id: 'reflection', label: 'Reflections' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto hide-scrollbar">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-normal text-white tracking-tight mb-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          Timeline
        </h1>
        
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-light transition-all border ${
                filter === f.id 
                  ? 'bg-white/10 text-white border-white/20' 
                  : 'bg-transparent text-white/40 border-white/[0.05] hover:bg-white/5 hover:text-white/70'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTimeline.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-white/30 font-light">No {filter !== 'all' ? filter : ''} events found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 max-w-3xl">
          {Object.entries(grouped).map(([day, events]) => (
            <div key={day}>
              <h3 className="text-xs text-white/40 font-light tracking-wide uppercase mb-4 sticky top-0 bg-[#050505]/80 backdrop-blur-sm py-2 z-10">
                {day}
              </h3>
              <div className="flex flex-col gap-4 pl-2 border-l border-white/[0.06]">
                {events.map((event) => (
                  <TimelineItem key={event.id} event={event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
