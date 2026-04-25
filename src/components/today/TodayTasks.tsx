import { useAppStore } from '../../store';
import { CheckSquare, Calendar, AlertTriangle } from 'lucide-react';

export function TodayTasks() {
  const { tasks } = useAppStore();
  const today = new Date().toISOString().split('T')[0];

  const todayTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate <= today
  );

  if (todayTasks.length === 0) return null;

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare className="w-4 h-4 text-white/40" />
        <h3 className="text-sm font-normal text-white/70 tracking-tight">Today's Focus</h3>
        <span className="text-[10px] text-white/40 font-light px-1.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.05]">
          {todayTasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {todayTasks
          .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
          .slice(0, 5)
          .map((task) => {
            const isOverdue = task.dueDate && task.dueDate < today;
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-b from-[#181818] to-[#111] border border-white/[0.04] group hover:border-white/[0.08] transition-all"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03), 0 2px 6px rgba(0,0,0,0.2)' }}
              >
                <div
                  className={`w-4 h-4 rounded border ${
                    task.status === 'completed'
                      ? 'bg-emerald-500/20 border-emerald-500/40'
                      : 'border-white/20 hover:border-white/40'
                  } transition-colors cursor-pointer shrink-0`}
                />
                <span className={`text-sm font-light flex-1 ${isOverdue ? 'text-[#ff8a8a]' : 'text-white/80'}`}>
                  {task.title}
                </span>
                {task.dueDate && (
                  <span className={`text-[10px] font-light flex items-center gap-1 ${isOverdue ? 'text-[#ff8a8a]' : 'text-white/40'}`}>
                    {isOverdue && <AlertTriangle className="w-3 h-3" />}
                    <Calendar className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
