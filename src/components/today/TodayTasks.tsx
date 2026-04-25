import { useAppStore } from '../../store';
import { Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeDueDate } from '../../utils/dateUtils';

interface TodayTasksProps {
  onAddTask?: () => void;
}

export function TodayTasks({ onAddTask }: TodayTasksProps) {
  const { tasks, updateTask } = useAppStore();
  const navigate = useNavigate();
  
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && t.dueDate <= today
  );

  if (todayTasks.length === 0) return null;

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const sortedTasks = [...todayTasks].sort((a, b) => {
    if (a.dueDate! < b.dueDate!) return -1;
    if (a.dueDate! > b.dueDate!) return 1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-medium text-white/80 tracking-tight">Tasks</h3>
          <span className="text-[10px] text-white/20 font-medium px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05]">
            {todayTasks.length}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-2 text-[10px] text-white/30 font-medium uppercase tracking-widest hover:text-white/60 transition-colors cursor-pointer group/view"
          >
            View all
            <ChevronRight className="w-3 h-3 group-hover/view:translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={onAddTask}
            className="flex items-center gap-2 text-[10px] text-white/30 font-medium uppercase tracking-widest hover:text-white/60 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        {sortedTasks.slice(0, 5).map((task) => {
          const { text: dueText, colorClass: dueColor } = formatRelativeDueDate(task.dueDate);
          
          return (
            <div
              key={task.id}
              className="group flex items-center justify-between py-4 border-b border-white/[0.03] hover:bg-white/[0.01] transition-all duration-300 px-1"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  onClick={() => updateTask(task.id, { status: 'completed' })}
                  className="w-5 h-5 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center transition-all bg-white/[0.02]"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white/0 group-hover:bg-white/5 transition-all" />
                </button>
                <span className="text-base font-light tracking-tight truncate text-white/80">
                  {task.title}
                </span>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-sm font-normal tracking-tight ${dueColor}`}>
                  {dueText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
