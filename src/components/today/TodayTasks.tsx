import { useState } from 'react';
import { useAppStore } from '../../store';
import { Plus, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatRelativeDueDate } from '../../utils/dateUtils';
import { TaskDetailModal } from '../tasks/TaskDetailModal';
import type { TaskStatus } from '../../store/types';

interface TodayTasksProps {
  onAddTask?: () => void;
  onTaskClick?: (taskId: string) => void;
}

export function TodayTasks({ onAddTask, onTaskClick }: TodayTasksProps) {
  const { tasks, updateTask } = useAppStore();
  const navigate = useNavigate();
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  
  const activeTasks = tasks.filter((t) => {
    return t.status !== 'completed';
  });

  if (activeTasks.length === 0) return null;

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const sortedTasks = [...activeTasks].sort((a, b) => {
    // 1. Handle due date presence
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // 2. Sort by due date if both exist
    if (a.dueDate && b.dueDate) {
      if (a.dueDate < b.dueDate) return -1;
      if (a.dueDate > b.dueDate) return 1;
    }
    
    // 3. Finally sort by priority
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const toggleTaskCompletion = (taskId: string, currentStatus: TaskStatus) => {
    if (currentStatus === 'completed' || completingTasks.has(taskId)) {
      setCompletingTasks(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
      if (currentStatus === 'completed') {
        updateTask(taskId, { status: 'to_do' });
      }
    } else {
      setCompletingTasks(prev => {
        const next = new Set(prev);
        next.add(taskId);
        return next;
      });
      
      setTimeout(() => {
        setCompletingTasks(prev => {
          if (prev.has(taskId)) {
            updateTask(taskId, { status: 'completed' });
            const next = new Set(prev);
            next.delete(taskId);
            return next;
          }
          return prev;
        });
      }, 1500);
    }
  };

  return (
    <div className="mt-4 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-medium text-white/80 tracking-tight">Tasks</h3>
          <span className="text-[10px] text-white/20 font-medium px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05]">
            {activeTasks.length}
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
          const isPendingCompletion = completingTasks.has(task.id);
          
          return (
            <div
              key={task.id}
              onClick={() => onTaskClick?.(task.id)}
              className="group flex items-center justify-between py-4 border-b border-white/[0.03] hover:bg-white/[0.01] transition-all duration-300 px-1 cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskCompletion(task.id, task.status);
                  }}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isPendingCompletion
                      ? 'bg-[#0a0a0a] border-[#8affb1]/30 text-[#8affb1] shadow-[0_0_15px_rgba(138,255,177,0.15)]'
                      : 'bg-transparent border-white/10 hover:border-white/30'
                  }`}
                  style={{
                    boxShadow: isPendingCompletion
                      ? 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.5)'
                      : 'none'
                  }}
                >
                  {isPendingCompletion && <Check className="w-3 h-3" strokeWidth={4} />}
                </button>
                <span className={`text-base font-light tracking-tight truncate transition-all duration-500 ${isPendingCompletion ? 'text-white/20 line-through' : 'text-white/80'}`}>
                  {task.title}
                </span>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-sm font-normal tracking-tight ${dueColor} ${isPendingCompletion ? 'opacity-30' : ''}`}>
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


