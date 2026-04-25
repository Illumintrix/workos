import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, List, LayoutGrid, X, Trash2, Calendar, Tag, Folder, Hash, Plus, Loader2, Mic, FileText, GitBranch } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { useAppStore } from '../store';
import { extractSingleItem } from '../engine/aiEngine';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskStatus } from '../store/types';

import { CustomDialog } from '../components/ui/CustomDialog';

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
  const { tasks, updateTask, deleteTask, addTask, projects, pendingOpenId, pendingOpenType, clearPendingOpen, setPendingOpen } = useAppStore();
  const navigate = useNavigate();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addText, setAddText] = useState('');
  const [linkSearch, setLinkSearch] = useState('');
  const [showLinkSearch, setShowLinkSearch] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showError, setShowError] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setShowError({ show: true, message: 'Speech recognition is not supported in this browser. Please try using Chrome or Edge.' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setAddText(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  const handleManualAdd = async () => {
    if (!addText.trim()) return;
    setIsExtracting(true);
    try {
      const extracted = await extractSingleItem(addText, 'task');
      if (extracted && extracted.title) {
        addTask({
          id: uuidv4(),
          title: extracted.title,
          description: extracted.description || '',
          status: extracted.status || 'to_do',
          priority: extracted.priority || 'medium',
          dueDate: extracted.dueDate || null,
          projectId: extracted.projectId || null,
          tags: extracted.tags || [],
          linkedNoteIds: [],
          linkedDecisionIds: [],
          sourceMessageId: 'manual',
          aiConfidence: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setIsAddModalOpen(false);
        setAddText('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

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
                const columnTasks = tasks.filter((t) => t.status === col.status);
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
            <div className="flex flex-col gap-2 overflow-y-auto pb-4 hide-scrollbar">
              {tasks.filter(t => t.title).map((task) => {
                const p = priorityColors[task.priority] || priorityColors.medium;
                const isOverdue = task.dueDate && task.dueDate < new Date().toISOString().split('T')[0] && task.status !== 'completed';
                const statusCol = statusColumns.find(col => col.status === task.status);

                return (
                  <div 
                    key={task.id} 
                    onClick={() => setActiveTaskId(task.id)}
                    className="flex items-center gap-4 p-5 rounded-xl bg-[#1a1a1a] border border-white/[0.05] hover:bg-[#222] transition-colors cursor-pointer group shadow-lg"
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTask(task.id, { status: task.status === 'completed' ? 'to_do' : 'completed' });
                        }}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-emerald-400/20 border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'border-white/20 hover:border-white/50 bg-white/[0.02]'}`}
                      >
                        {task.status === 'completed' && <CheckSquare className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`text-base font-light tracking-tight ${task.status === 'completed' ? 'text-white/30 line-through' : 'text-white/90'}`}>{task.title}</span>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      {projects.find(p => p.id === task.projectId)?.name && <span className="text-white/40">{projects.find(p => p.id === task.projectId)?.name}</span>}
                      {task.dueDate && (
                        <span className={`${isOverdue ? 'text-[#ff8a8a]' : 'text-white/40'}`}>
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-normal tracking-wide border bg-gradient-to-b ${p.bg} ${p.text} ${p.border}`}>
                        {task.priority}
                      </span>
                      <span className="text-white/40 w-24 text-right">{statusCol?.label}</span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTaskToDelete(task.id);
                        }}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                {/* Status */}
                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-white/60 flex items-center gap-2 font-medium"><CheckSquare className="w-3 h-3 text-purple-400/60"/> Status</span>
                  <CustomSelect
                    value={activeTask.status}
                    onChange={(val) => updateTask(activeTask.id, { status: val as TaskStatus })}
                    options={statusColumns.map(col => ({ value: col.status, label: col.label }))}
                    className="flex-1"
                  />
                </div>

                {/* Priority */}
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

                {/* Due Date */}
                <div className="flex items-center gap-4">
                  <span className="w-24 text-xs text-white/60 flex items-center gap-2 font-medium"><Calendar className="w-3 h-3 text-purple-400/60"/> Due Date</span>
                  <input
                    type="date"
                    value={activeTask.dueDate || ''}
                    onChange={(e) => updateTask(activeTask.id, { dueDate: e.target.value || undefined })}
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none border-none p-0 [color-scheme:dark]"
                  />
                </div>

                {/* Project */}
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

                {/* Tags */}
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

              {/* Related Items */}
              <div className="border-t border-white/[0.05] pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-white/60 font-medium uppercase tracking-wider">Related Context</span>
                  <div className="relative group">
                    <button 
                      onClick={() => setShowLinkSearch(!showLinkSearch)}
                      className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-[10px]"
                    >
                      <Plus className="w-3 h-3" />
                      Link Item
                    </button>
                    {showLinkSearch && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-white/[0.08] rounded-xl shadow-2xl z-[60] p-2 animate-in fade-in zoom-in-95 duration-200">
                        <input
                          autoFocus
                          type="text"
                          value={linkSearch}
                          onChange={(e) => setLinkSearch(e.target.value)}
                          placeholder="Search tasks, notes, decisions..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/20 mb-2"
                        />
                        <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                          {/* Search Results */}
                          {[
                            ...tasks.filter(t => t.id !== activeTask.id && t.title.toLowerCase().includes(linkSearch.toLowerCase())).map(t => ({ ...t, type: 'task' })),
                            ...useAppStore.getState().notes.filter(n => n.title.toLowerCase().includes(linkSearch.toLowerCase())).map(n => ({ ...n, type: 'note' })),
                            ...useAppStore.getState().decisions.filter(d => d.title.toLowerCase().includes(linkSearch.toLowerCase())).map(d => ({ ...d, type: 'decision' }))
                          ].slice(0, 10).map((item: any) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (item.type === 'task') {
                                  updateTask(activeTask.id, { linkedTaskIds: [...(activeTask.linkedTaskIds || []), item.id] });
                                } else if (item.type === 'note') {
                                  updateTask(activeTask.id, { linkedNoteIds: [...(activeTask.linkedNoteIds || []), item.id] });
                                } else {
                                  updateTask(activeTask.id, { linkedDecisionIds: [...(activeTask.linkedDecisionIds || []), item.id] });
                                }
                                setShowLinkSearch(false);
                                setLinkSearch('');
                              }}
                              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left transition-colors group"
                            >
                              {item.type === 'task' ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400/40" /> : 
                               item.type === 'note' ? <FileText className="w-3.5 h-3.5 text-blue-400/40" /> : 
                               <GitBranch className="w-3.5 h-3.5 text-purple-400/40" />}
                              <div className="flex-1 min-w-0">
                                <div className="text-[11px] text-white/70 truncate">{item.title}</div>
                                <div className="text-[9px] text-white/20 uppercase tracking-tighter">{item.type}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {/* Linked Tasks */}
                  {useAppStore.getState().tasks.filter(t => t.id !== activeTask.id && ((activeTask.linkedTaskIds?.includes(t.id)) || t.linkedTaskIds?.includes(activeTask.id))).map(task => (
                    <div 
                      key={task.id}
                      onClick={() => setActiveTaskId(task.id)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-colors cursor-pointer group"
                    >
                      <CheckSquare className="w-4 h-4 text-purple-400/60" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white/80 font-normal truncate">{task.title}</div>
                        <div className="text-[10px] text-white/30 truncate">Task • {task.status}</div>
                      </div>
                    </div>
                  ))}

                  {/* Linked Notes */}
                  {[
                    ...useAppStore.getState().notes.filter(n => activeTask.linkedNoteIds?.includes(n.id) || n.linkedTaskIds?.includes(activeTask.id))
                  ].map(note => (
                    <div 
                      key={note.id}
                      onClick={() => {
                        setPendingOpen('note', note.id);
                        navigate('/notes');
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-colors cursor-pointer group"
                    >
                      <FileText className="w-4 h-4 text-blue-400/60" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white/80 font-normal truncate">{note.title}</div>
                        <div className="text-[10px] text-white/30 truncate">Note • {note.category}</div>
                      </div>
                    </div>
                  ))}

                  {/* Linked Decisions */}
                  {[
                    ...useAppStore.getState().decisions.filter(d => activeTask.linkedDecisionIds?.includes(d.id) || d.linkedTaskIds?.includes(activeTask.id))
                  ].map(decision => (
                    <div 
                      key={decision.id}
                      onClick={() => {
                        setPendingOpen('decision', decision.id);
                        navigate('/decisions');
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-colors cursor-pointer group"
                    >
                      <GitBranch className="w-4 h-4 text-purple-400/60" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white/80 font-normal truncate">{decision.title}</div>
                        <div className="text-[10px] text-white/30 truncate">Decision</div>
                      </div>
                    </div>
                  ))}

                  {activeTask.linkedTaskIds?.length === 0 && activeTask.linkedNoteIds?.length === 0 && activeTask.linkedDecisionIds?.length === 0 && 
                   useAppStore.getState().tasks.filter(t => t.linkedTaskIds?.includes(activeTask.id)).length === 0 &&
                   useAppStore.getState().notes.filter(n => n.linkedTaskIds?.includes(activeTask.id)).length === 0 &&
                   useAppStore.getState().decisions.filter(d => d.linkedTaskIds?.includes(activeTask.id)).length === 0 && (
                    <div className="text-xs text-white/20 italic font-light">No linked items yet. The AI will link context automatically as you chat.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/[0.05] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Add a Task</h3>
            <p className="text-sm text-white/40 font-light mb-6">Type naturally. The AI will extract the title, due date, priority, and project.</p>
            
            <div className="relative mb-6">
              <textarea
                value={addText}
                onChange={(e) => setAddText(e.target.value)}
                placeholder="e.g., Need to finish the duplicate management PRD by Friday, high priority for the Growth project."
                className="w-full h-32 bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-4 pr-12 text-white text-sm focus:outline-none focus:border-white/20 resize-none shadow-inner"
                autoFocus
              />
              <button
                onClick={startListening}
                className={`absolute bottom-4 right-4 p-2 rounded-lg transition-all ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                title="Voice Dictation"
              >
                <Mic className={`w-4 h-4 ${isListening ? 'fill-red-400' : ''}`} />
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAdd}
                disabled={!addText.trim() || isExtracting}
                className="px-4 py-2 bg-white text-black hover:bg-white/90 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {isExtracting ? 'Extracting...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
      <CustomDialog
        isOpen={showError.show}
        onClose={() => setShowError({ show: false, message: '' })}
        title="Voice Capture Unavailable"
        message={showError.message}
        type="danger"
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
