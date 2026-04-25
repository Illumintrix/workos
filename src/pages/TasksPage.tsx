import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, List, LayoutGrid, Trash2, Calendar, Tag, Folder, Hash, Plus, ChevronRight } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { useAppStore } from '../store';
import { TaskAddModal } from '../components/tasks/TaskAddModal';
import { CustomDialog } from '../components/ui/CustomDialog';
import { getTaskTimeBucket, formatRelativeDueDate } from '../utils/dateUtils';
import type { TimeBucket } from '../utils/dateUtils';
import type { Task, TaskStatus } from '../store/types';

const statusColumns: { status: TaskStatus; label: string; color: string; dotStyle?: React.CSSProperties }[] = [
  { status: 'to_do', label: 'To Do', color: 'bg-white/30' },
  { status: 'in_progress', label: 'In Progress', color: 'bg-amber-400', dotStyle: { boxShadow: '0 0 8px rgba(251,191,36,0.5)' } },
  { status: 'hold', label: 'Hold', color: 'bg-purple-400', dotStyle: { boxShadow: '0 0 8px rgba(192,132,252,0.5)' } },
  { status: 'completed', label: 'Completed', color: 'bg-emerald-400', dotStyle: { boxShadow: '0 0 8px rgba(52,211,153,0.5)' } },
];

const priorityColors = {
  high: { bg: 'from-[#3a1d1d] to-[#241010]', text: 'text-[#ff8a8a]', border: 'border-[#522525]' },
  medium: { bg: 'from-[#3a3a1d] to-[#242410]', text: 'text-[#ffd98a]', border: 'border-[#525225]' },
  low: { bg: 'from-[#1d3a24] to-[#102415]', text: 'text-[#8affb1]', border: 'border-[#2b5936]' },
};

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
  const { tasks, updateTask, deleteTask, projects, pendingOpenId, pendingOpenType, clearPendingOpen, setPendingOpen } = useAppStore();
  const navigate = useNavigate();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
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

  const activeTask = tasks.find((t) => t.id === activeTaskId);

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
            <CheckSquare className="w-6 h-6 text-white/50" />
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-normal text-white tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                Tasks
              </h1>
              <p className="text-sm text-white/40 font-light mt-1">{tasks.length} total tasks</p>
            </div>
            <div className="flex items-center gap-4">
              {view === 'kanban' && (
                <div className="w-40">
                  <CustomSelect
                    value={timeframeFilter}
                    onChange={(val) => setTimeframeFilter(val as any)}
                    options={[
                      { value: 'All', label: 'All Time' },
                      { value: 'Today', label: 'Today' },
                      { value: 'In this week', label: 'In this week' },
                      { value: 'Upcoming', label: 'Upcoming' }
                    ]}
                  />
                </div>
              )}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
              <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-white/[0.05]">
                <button
                  onClick={() => setView('kanban')}
                  className={`p-1.5 rounded-md transition-colors ${view === 'kanban' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                  title="Kanban View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {view === 'kanban' ? (
            <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar flex-1">
              {statusColumns.map((col) => {
                const columnTasks = filteredTasks.filter((t) => t.status === col.status);
                return (
                  <div 
                    key={col.status} 
                    className="flex flex-col min-w-[260px] w-[260px] h-full"
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
            <div className="flex flex-col gap-8 overflow-y-auto pb-10 hide-scrollbar">
              {(Object.keys(groupedTasks) as TimeBucket[]).map((bucket) => {
                const bucketTasks = groupedTasks[bucket];
                if (bucketTasks.length === 0) return null;

                return (
                  <div key={bucket} className="flex flex-col">
                    <div className="flex items-center gap-3 mb-4 px-1">
                      <h3 className="text-sm font-medium text-white/60">{bucket}</h3>
                      <span className="text-[10px] text-white/20 font-medium px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05]">
                        {bucketTasks.length}
                      </span>
                    </div>

                    <div className="flex flex-col border border-white/[0.03] rounded-xl overflow-hidden bg-white/[0.01]">
                      {/* Table Header */}
                      <div className="flex items-center px-4 py-2 border-b border-white/[0.03] bg-white/[0.02] text-[10px] text-white/20 font-medium uppercase tracking-widest">
                        <div className="flex-1">Task</div>
                        <div className="w-40 px-4">Due Date</div>
                        <div className="w-48 px-4">Project</div>
                        <div className="w-32 px-4 text-right">Status</div>
                      </div>

                      {bucketTasks.map((task) => {
                        const project = projects.find(p => p.id === task.projectId);
                        const { text: dueText, colorClass: dueColor } = formatRelativeDueDate(task.dueDate);
                        const statusCol = statusColumns.find(col => col.status === task.status);

                        return (
                          <div 
                            key={task.id}
                            onClick={() => setActiveTaskId(task.id)}
                            className="flex items-center px-4 py-3.5 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                          >
                            <div className="flex-1 flex items-center gap-4 min-w-0">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateTask(task.id, { status: task.status === 'completed' ? 'to_do' : 'completed' });
                                }}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${task.status === 'completed' ? 'bg-emerald-400/20 border-emerald-400 text-emerald-400' : 'border-white/10 hover:border-white/30 bg-white/[0.02]'}`}
                              >
                                {task.status === 'completed' && <CheckSquare className="w-3.5 h-3.5" />}
                              </button>
                              <span className={`text-sm font-light tracking-tight truncate ${task.status === 'completed' ? 'text-white/20 line-through' : 'text-white/80'}`}>
                                {task.title}
                              </span>
                            </div>

                            <div className="w-40 px-4 shrink-0">
                              <span className={`text-[11px] font-medium tracking-tight ${dueColor}`}>
                                {dueText}
                              </span>
                            </div>

                            <div className="w-48 px-4 shrink-0 flex items-center gap-2">
                              {project ? (
                                <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] max-w-full">
                                  <Folder className="w-3 h-3 text-white/20" />
                                  <span className="text-[10px] text-white/40 truncate">{project.name}</span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-white/10">—</span>
                              )}
                            </div>

                            <div className="w-32 px-4 shrink-0 flex items-center justify-end gap-3">
                              <span className="text-[10px] text-white/30 uppercase tracking-widest">{statusCol?.label}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTaskToDelete(task.id);
                                }}
                                className="p-1.5 rounded-lg text-red-400/40 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 hover:text-red-400"
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
          )}
        </>
      )}

      {/* Task Detail Modal */}
      {activeTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/[0.05] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-purple-400/80" />
                <span className="text-sm text-white/70 font-medium">Task Details</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    deleteTask(activeTask.id);
                    setActiveTaskId(null);
                  }}
                  className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTaskId(null)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <input
                type="text"
                value={activeTask.title}
                onChange={(e) => updateTask(activeTask.id, { title: e.target.value })}
                className="text-2xl font-normal text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-white/20"
                placeholder="Task title..."
              />

              <div className="flex flex-col gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-white/60 flex items-center gap-2 font-medium"><CheckSquare className="w-3 h-3 text-purple-400/60"/> Status</span>
                  <CustomSelect
                    value={activeTask.status}
                    onChange={(val) => updateTask(activeTask.id, { status: val as TaskStatus })}
                    options={statusColumns.map(col => ({ value: col.status, label: col.label }))}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-white/60 flex items-center gap-2 font-medium"><Tag className="w-3 h-3 text-purple-400/60"/> Priority</span>
                  <CustomSelect
                    value={activeTask.priority}
                    onChange={(val) => updateTask(activeTask.id, { priority: val as any })}
                    options={[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' }
                    ]}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-white/60 flex items-center gap-2 font-medium"><Calendar className="w-3 h-3 text-purple-400/60"/> Due Date</span>
                  <input
                    type="date"
                    value={activeTask.dueDate || ''}
                    onChange={(e) => updateTask(activeTask.id, { dueDate: e.target.value || undefined })}
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none border-none p-0 [color-scheme:dark]"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-white/60 flex items-center gap-2 font-medium"><Folder className="w-3 h-3 text-purple-400/60"/> Project</span>
                  <CustomSelect
                    value={activeTask.projectId || 'none'}
                    onChange={(val) => updateTask(activeTask.id, { projectId: val === 'none' ? null : val })}
                    options={[
                      { value: 'none', label: 'None' },
                      ...projects.map(p => ({ value: p.id, label: p.name }))
                    ]}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-white/60 flex items-center gap-2 font-medium"><Hash className="w-3 h-3 text-purple-400/60"/> Tags</span>
                  <input
                    type="text"
                    value={activeTask.tags.join(', ')}
                    onChange={(e) => updateTask(activeTask.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    placeholder="tag1, tag2..."
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none border-none p-0 placeholder:text-white/20"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs text-white/60 font-medium block mb-2 uppercase tracking-wider">Description</span>
                <textarea
                  value={activeTask.description || ''}
                  onChange={(e) => updateTask(activeTask.id, { description: e.target.value })}
                  className="w-full h-32 bg-transparent text-sm text-white/80 focus:outline-none resize-none leading-relaxed placeholder:text-white/20 mb-4"
                  placeholder="Add any additional details or context here..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
