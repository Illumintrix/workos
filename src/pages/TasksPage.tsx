import { useState, useEffect, useMemo } from 'react';

import { Check, List, LayoutGrid, Trash2, Plus } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { useAppStore } from '../store';
import { TaskAddModal } from '../components/tasks/TaskAddModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { CustomDialog } from '../components/ui/CustomDialog';
import { getTaskTimeBucket, formatRelativeDueDate } from '../utils/dateUtils';
import { statusColumns, priorityColors } from '../constants/tasks';
import type { TimeBucket } from '../utils/dateUtils';
import type { Task, TaskStatus } from '../store/types';

function TaskCard({ task, onDragStart, onClick, onDelete }: { task: Task; onDragStart?: (e: React.DragEvent, taskId: string) => void; onClick?: () => void; onDelete?: (e: React.MouseEvent) => void }) {
  const { projects } = useAppStore();
  const p = priorityColors[task.priority] || priorityColors.medium;
  const isOverdue = task.dueDate && task.dueDate < new Date().toISOString().split('T')[0] && task.status !== 'completed';
  const project = projects.find(proj => proj.id === task.projectId);

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      onClick={onClick}
      className={`p-4 rounded-xl bg-gradient-to-b from-[#2a2a2a] to-[#111] border border-white/[0.05] group transition-all relative ${onDragStart ? 'cursor-grab active:cursor-grabbing hover:border-white/[0.1]' : ''} ${onClick ? 'cursor-pointer' : ''}`}
      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.3)' }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(e);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
        title="Delete task"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-0.5 rounded text-[10px] font-normal tracking-wide border bg-gradient-to-b ${p.bg} ${p.text} ${p.border}`}>
          {task.priority}
        </span>
        {project && (
          <span className="text-[10px] text-white/40 font-light px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.05]">
            {project.name}
          </span>
        )}
      </div>
      <h4 className="text-sm text-white font-normal mb-1 tracking-tight group-hover:text-white/80 transition-colors pr-6">
        {task.title}
      </h4>
      {task.description && (
        <p className="text-xs text-white/40 font-light line-clamp-2 leading-relaxed mb-3">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-auto">
        {task.dueDate && (
          <span className={`text-[10px] font-light ${isOverdue ? 'text-[#ff8a8a]' : 'text-white/40'}`}>
            {isOverdue ? '⚠ ' : ''}Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
        {task.tags.length > 0 && (
          <div className="flex gap-1">
            {task.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] text-white/30 font-light">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function TasksPage() {
  const { tasks, updateTask, deleteTask, projects, pendingOpenId, pendingOpenType, clearPendingOpen } = useAppStore();
  const [view, setView] = useState<'kanban' | 'list'>('list');
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  const [timeframeFilter, setTimeframeFilter] = useState<'All' | 'Today' | 'In this week' | 'Upcoming'>('All');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (pendingOpenId && pendingOpenType === 'task') {
      if (pendingOpenId === 'new') {
        setIsAddModalOpen(true);
      } else {
        setActiveTaskId(pendingOpenId);
      }
      clearPendingOpen();
    }
  }, [pendingOpenId, pendingOpenType, clearPendingOpen]);

  const filteredTasks = useMemo(() => {
    if (timeframeFilter === 'All') return tasks;
    return tasks.filter(t => getTaskTimeBucket(t.dueDate, t.status) === timeframeFilter);
  }, [tasks, timeframeFilter]);

  const groupedTasks = useMemo(() => {
    const groups: Record<TimeBucket, Task[]> = {
      'Today': [],
      'In this week': [],
      'Upcoming': [],
      'Completed': []
    };

    tasks.filter(t => t.title).forEach(task => {
      const bucket = getTaskTimeBucket(task.dueDate, task.status);
      groups[bucket].push(task);
    });

    // Sort within groups
    Object.keys(groups).forEach(key => {
      const bucket = key as TimeBucket;
      groups[bucket].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    });

    return groups;
  }, [tasks]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTask(taskId, { status });
    }
  };

  const toggleTaskCompletion = (taskId: string, currentStatus: TaskStatus) => {
    if (currentStatus === 'completed') {
      // Immediate uncheck
      updateTask(taskId, { status: 'to_do' });
      setCompletingTasks(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    } else {
      // Delayed completion
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
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col hide-scrollbar">
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
          <div
            className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center mb-5"
            style={{
              boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Check className="w-6 h-6 text-white/50" />
          </div>
          <h2 className="text-lg font-normal text-white mb-2 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            No tasks yet
          </h2>
          <p className="text-sm text-white/40 font-light max-w-sm leading-relaxed">
            Tell me what you're working on and I'll organize it for you. Head to the Today page and start a conversation.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/[0.05]"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <CustomSelect
                  value={timeframeFilter}
                  onChange={(val) => setTimeframeFilter(val as any)}
                  options={[
                    { value: 'All', label: 'All Time' },
                    { value: 'Today', label: 'Today' },
                    { value: 'In this week', label: 'In this week' },
                    { value: 'Upcoming', label: 'Upcoming' }
                  ]}
                  triggerClassName="text-2xl sm:text-3xl font-normal text-white tracking-tight hover:text-white/80 transition-colors group flex items-center gap-2"
                  chevronClassName="w-6 h-6"
                  showChevron={true}
                />
              </div>
              <p className="text-sm text-white/40 font-light mt-1 ml-0.5">
                {filteredTasks.length} {timeframeFilter === 'All' ? 'total' : timeframeFilter.toLowerCase()} tasks
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/[0.05]"
                style={{
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
              <div className="flex bg-[#111] rounded-xl p-1 border border-white/[0.05] shadow-inner">
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('kanban')}
                  className={`p-2 rounded-lg transition-all ${view === 'kanban' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/80'}`}
                  title="Kanban View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {view === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4 flex-1">
              {statusColumns.map((col) => {
                const columnTasks = filteredTasks.filter((t) => t.status === col.status);
                return (
                  <div 
                    key={col.status} 
                    className="flex flex-col h-full min-w-0"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.status)}
                  >
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${col.color}`} style={col.dotStyle} />
                        <span className="text-sm font-normal text-white">{col.label}</span>
                      </div>
                      <span className="text-xs text-white/40 bg-white/[0.05] px-2 py-0.5 rounded-md border border-white/[0.05]">
                        {columnTasks.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 min-h-[100px] rounded-xl transition-colors border border-transparent">
                      {columnTasks.map((task) => (
                        task.title && (
                          <TaskCard 
                            key={task.id} 
                            task={task} 
                            onDragStart={handleDragStart} 
                            onClick={() => setActiveTaskId(task.id)} 
                            onDelete={() => setTaskToDelete(task.id)}
                          />
                        )
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div 
              className="flex flex-col flex-1 overflow-hidden min-h-0 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-white/[0.05] shadow-2xl relative"
              style={{ 
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8), 0 24px 48px -12px rgba(0,0,0,0.9)' 
              }}
            >
              {/* Master Header */}
              <div className="flex items-center px-6 py-2.5 border-b border-white/[0.04] bg-[#111]/80 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 sticky top-0 z-20 backdrop-blur-2xl">
                <div className="w-14 shrink-0"></div>
                <div className="flex-1 min-w-[200px]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Task</div>
                <div className="w-44 px-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Due Date</div>
                <div className="w-64 px-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Project</div>
                <div className="w-10"></div> {/* Delete button spacer */}
              </div>

              <div className="flex-1 overflow-y-auto pb-10 hide-scrollbar scroll-smooth">
                {(Object.keys(groupedTasks) as TimeBucket[]).map((bucket) => {
                  const bucketTasks = groupedTasks[bucket];
                  if (bucketTasks.length === 0) return null;
                  
                  // If timeframe filter is active and not 'All', only show the matching bucket
                  if (timeframeFilter !== 'All' && timeframeFilter !== bucket) return null;

                  return (
                    <div key={bucket} className="flex flex-col">
                      {/* Inline Section Header */}
                      <div className="flex items-center gap-3 px-8 py-3 border-b border-white/[0.03] bg-white/[0.01]">
                        <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                          {bucket}
                        </h3>
                        <span className="text-[8px] text-white/20 font-black px-1.5 py-0.5 rounded-full bg-white/[0.02] border border-white/[0.04]">
                          {bucketTasks.length}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        {bucketTasks.map((task) => {
                          const project = projects.find(p => p.id === task.projectId);
                          const { text: dueText, colorClass: dueColor } = formatRelativeDueDate(task.dueDate);
                          
                          const isMarkedCompleted = task.status === 'completed';
                          const isPendingCompletion = completingTasks.has(task.id);
                          const isCurrentlyChecked = isMarkedCompleted || isPendingCompletion;

                          return (
                            <div 
                              key={task.id}
                              onClick={() => setActiveTaskId(task.id)}
                              className="flex items-center px-6 py-4 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.03] active:scale-[0.998] transition-all cursor-pointer group relative"
                            >
                              <div className="w-14 flex justify-center shrink-0">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTaskCompletion(task.id, task.status);
                                  }}
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                                    isCurrentlyChecked 
                                      ? 'bg-[#0a0a0a] border-[#8affb1]/30 text-[#8affb1] shadow-[0_0_15px_rgba(138,255,177,0.15)]' 
                                      : 'bg-transparent border-white/20 hover:border-white/40'
                                  }`}
                                  style={{
                                    boxShadow: isCurrentlyChecked 
                                      ? 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.5)'
                                      : 'none'
                                  }}
                                >
                                  {isCurrentlyChecked && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                                </button>
                              </div>

                              <div className="flex-1 min-w-[200px] pr-4">
                                <span 
                                  className={`text-sm font-light tracking-tight truncate block leading-none transition-all duration-500 ${isCurrentlyChecked ? 'text-white/20 line-through' : 'text-white/90'}`}
                                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                                >
                                  {task.title}
                                </span>
                              </div>

                              <div className="w-44 px-4 shrink-0">
                                <span 
                                  className={`text-[11px] font-medium tracking-tight leading-none transition-all duration-500 ${dueColor} ${isCurrentlyChecked ? 'opacity-30' : ''}`} 
                                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                                >
                                  {dueText}
                                </span>
                              </div>

                              <div className="w-64 px-4 shrink-0 flex items-center gap-2">
                                {project ? (
                                  <div className={`flex items-center gap-2 px-2.5 py-1 rounded border bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] max-w-full shadow-lg ${isCurrentlyChecked ? 'opacity-20 border-white/[0.03]' : 'border-white/[0.1]'}`}>
                                    <span className="text-[10px] text-white/70 font-semibold truncate leading-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                                      {project.name}
                                    </span>
                                  </div>
                                ) : (
                                  <div className={`flex items-center gap-2 px-2.5 py-1 rounded border border-white/[0.05] bg-white/[0.01] shadow-inner ${isCurrentlyChecked ? 'opacity-10' : 'opacity-40'}`}>
                                    <span className="text-[10px] text-white/60 font-medium leading-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                                      No Project
                                    </span>
                                  </div>
                                )}
                              </div>


                              <div className="w-10 flex justify-end">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setTaskToDelete(task.id);
                                  }}
                                  className="p-1.5 rounded-lg text-red-400/30 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-400 active:scale-90"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <TaskDetailModal 
        taskId={activeTaskId} 
        onClose={() => setActiveTaskId(null)} 
      />

      <TaskAddModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <CustomDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete);
            setTaskToDelete(null);
          }
        }}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        type="danger"
        confirmLabel="Delete Permanent"
        cancelLabel="Cancel"
      />
    </div>
  );
}

