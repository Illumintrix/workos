import { Check, Trash2, X } from 'lucide-react';
import { useAppStore } from '../../store';
import { CustomSelect } from '../ui/CustomSelect';
import { statusColumns } from '../../constants/tasks';
import { RelatedContext } from '../common/RelatedContext';
import type { TaskStatus } from '../../store/types';

interface TaskDetailModalProps {
  taskId: string | null;
  onClose: () => void;
}

export function TaskDetailModal({ taskId, onClose }: TaskDetailModalProps) {
  const { tasks, updateTask, deleteTask, projects } = useAppStore();
  
  const task = tasks.find((t) => t.id === taskId);
  
  if (!taskId || !task) return null;

  const handleLink = (id: string, type: string) => {
    if (type === 'task') {
      updateTask(task.id, { linkedTaskIds: [...(task.linkedTaskIds || []), id] });
    } else if (type === 'note') {
      updateTask(task.id, { linkedNoteIds: [...(task.linkedNoteIds || []), id] });
    } else if (type === 'decision') {
      updateTask(task.id, { linkedDecisionIds: [...(task.linkedDecisionIds || []), id] });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0f0f0f] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 24px 48px -12px rgba(0,0,0,0.5)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-white/[0.05] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Check className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-sm text-white/90 font-semibold tracking-tight">Task Details</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                deleteTask(task.id);
                onClose();
              }}
              className="p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 px-6 flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-5">
          <input
            type="text"
            value={task.title}
            onChange={(e) => updateTask(task.id, { title: e.target.value })}
            className="w-full bg-transparent border-none text-xl text-white font-normal focus:outline-none focus:ring-0 px-0 placeholder:text-white/20"
            placeholder="Task Title"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Status */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="w-20 text-[10px] text-white/40 flex items-center gap-2 font-semibold uppercase tracking-wider">
                Status
              </span>
              <CustomSelect
                value={task.status}
                onChange={(val) => updateTask(task.id, { status: val as TaskStatus })}
                options={statusColumns.map(col => ({ value: col.status, label: col.label }))}
                className="flex-1"
                triggerClassName="bg-transparent border-none p-0 text-xs font-normal"
              />
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="w-20 text-[10px] text-white/40 flex items-center gap-2 font-semibold uppercase tracking-wider">
                Priority
              </span>
              <CustomSelect
                value={task.priority}
                onChange={(val) => updateTask(task.id, { priority: val as any })}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' }
                ]}
                className="flex-1"
                triggerClassName="bg-transparent border-none p-0 text-xs font-normal"
              />
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="w-20 text-[10px] text-white/40 flex items-center gap-2 font-semibold uppercase tracking-wider">
                Due Date
              </span>
              <input
                type="date"
                value={task.dueDate ? task.dueDate.split('T')[0] : ''}
                onChange={(e) => updateTask(task.id, { dueDate: e.target.value || undefined })}
                className="flex-1 bg-transparent text-xs text-white focus:outline-none border-none p-0 [color-scheme:dark]"
              />
            </div>

            {/* Project */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <span className="w-20 text-[10px] text-white/40 flex items-center gap-2 font-semibold uppercase tracking-wider">
                Project
              </span>
              <CustomSelect
                value={task.projectId || 'none'}
                onChange={(val) => updateTask(task.id, { projectId: val === 'none' ? null : val })}
                options={[
                  { value: 'none', label: 'None' },
                  ...projects.map(p => ({ value: p.id, label: p.name }))
                ]}
                className="flex-1"
                triggerClassName="bg-transparent border-none p-0 text-xs font-normal"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 font-semibold block mb-2 uppercase tracking-widest">Description</span>
            <textarea
              value={task.description || ''}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              className="w-full bg-transparent border-none text-sm text-white/70 font-light leading-relaxed focus:outline-none focus:ring-0 px-0 resize-none placeholder:text-white/20 min-h-[100px]"
              placeholder="Add details..."
            />
          </div>

          {/* Related Items */}
          <RelatedContext 
            currentId={task.id}
            currentType="task"
            linkedTaskIds={task.linkedTaskIds}
            linkedNoteIds={task.linkedNoteIds}
            linkedDecisionIds={task.linkedDecisionIds}
            onLink={handleLink}
          />
        </div>
      </div>
    </div>
  );
}

