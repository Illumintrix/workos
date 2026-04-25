import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, X, Trash2, Plus, Loader2, CheckSquare, GitBranch } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { useAppStore } from '../store';
import { extractSingleItem } from '../engine/aiEngine';
import { CustomDialog } from '../components/ui/CustomDialog';
import { v4 as uuidv4 } from 'uuid';
import type { Note } from '../store/types';

export function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, projects, pendingOpenId, pendingOpenType, clearPendingOpen, setPendingOpen } = useAppStore();
  const navigate = useNavigate();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (pendingOpenId && pendingOpenType === 'note') {
      if (pendingOpenId === 'new') {
        setIsAddModalOpen(true);
      } else {
        setActiveNoteId(pendingOpenId);
      }
      clearPendingOpen();
    }
  }, [pendingOpenId, pendingOpenType, clearPendingOpen]);
  const [filter, setFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addText, setAddText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  
  const activeNote = notes.find(n => n.id === activeNoteId);

  const filteredNotes = notes.filter(n => filter === 'All' || n.category === filter);
  const allCategories = Array.from(new Set(notes.map(n => n.category))).filter(Boolean);
  
  const groupedNotes = filteredNotes.reduce((acc, note) => {
    const category = note.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  const openNote = (note: Note) => {
    setActiveNoteId(note.id);
  };

  const closeNote = () => {
    setActiveNoteId(null);
  };

  const handleManualAdd = async () => {
    if (!addText.trim()) return;
    
    setIsExtracting(true);
    try {
      const extracted = await extractSingleItem(addText, 'note');
      if (extracted) {
        const newNote: Note = {
          id: uuidv4(),
          title: extracted.title || 'Untitled Note',
          content: extracted.content || addText,
          category: extracted.category || 'General',
          tags: extracted.tags || [],
          linkedTaskIds: [],
          linkedDecisionIds: [],
          sourceMessageId: '',
          projectId: extracted.projectId || null,
          aiConfidence: 'high',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addNote(newNote);
        setAddText('');
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to extract note:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="relative h-full flex overflow-hidden">
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto hide-scrollbar transition-all duration-300">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div
              className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center mb-5"
              style={{
                boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <FileText className="w-6 h-6 text-white/50" />
            </div>
            <h2 className="text-lg font-normal text-white mb-2 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              No notes yet
            </h2>
            <p className="text-sm text-white/40 font-light max-w-sm leading-relaxed">
              Start a conversation and I'll build your notes automatically. Every piece of context you share gets captured.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/[0.05]"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-normal text-white tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  Notes
                </h1>
                <p className="text-sm text-white/40 font-light mt-1 mb-4">{notes.length} notes across {allCategories.length} categories</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setFilter('All')}
                  className={`px-3 py-1.5 rounded-full text-xs font-light transition-all border ${
                    filter === 'All' ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-white/40 border-white/[0.05] hover:bg-white/5 hover:text-white/70'
                  }`}
                >
                  All Notes
                </button>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-light transition-all border ${
                      filter === cat ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-white/40 border-white/[0.05] hover:bg-white/5 hover:text-white/70'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            {Object.entries(groupedNotes).map(([category, categoryNotes]) => (
              <div key={category} className="mb-8">
                <h3 className="text-sm font-normal text-white/60 tracking-wide uppercase mb-4">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {categoryNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => openNote(note)}
                      className={`p-5 rounded-2xl bg-gradient-to-b from-[#1e1e1e] to-[#141414] border cursor-pointer hover:border-white/[0.1] transition-all group relative ${activeNoteId === note.id ? 'border-white/20' : 'border-white/[0.05]'}`}
                      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)' }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteToDelete(note.id);
                        }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <h4 className="text-sm text-white font-normal tracking-tight mb-2 group-hover:text-white/80 transition-colors pr-6">
                        {note.title}
                      </h4>
                      <p className="text-xs text-white/40 font-light line-clamp-3 leading-relaxed mb-3">{note.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/30 font-light px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.05]">
                            {note.category}
                          </span>
                          {projects.find(p => p.id === note.projectId) && (
                            <span className="text-[10px] text-white/30 font-light px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.05]">
                              {projects.find(p => p.id === note.projectId)?.name}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-white/30 font-light">
                          {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Note Detail Modal */}
      {activeNote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/[0.05] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400/80" />
                <span className="text-sm text-white/70 font-medium">Note Details</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setNoteToDelete(activeNote.id);
                    setActiveNoteId(null);
                  }} 
                  className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors" 
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={closeNote} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-6">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="w-full bg-transparent border-none text-2xl text-white font-normal focus:outline-none focus:ring-0 px-0 placeholder:text-white/20"
                placeholder="Note Title"
              />
              
               <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="w-24 text-xs text-white/60 flex items-center gap-2 font-medium">Project</span>
                <CustomSelect
                  value={activeNote.projectId || 'none'}
                  onChange={(val) => updateNote(activeNote.id, { projectId: val === 'none' ? null : val })}
                  options={[
                    { value: 'none', label: 'None' },
                    ...projects.map(p => ({ value: p.id, label: p.name }))
                  ]}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="w-24 text-xs text-white/60 flex items-center gap-2 font-medium"><FileText className="w-3 h-3 text-white/40"/> Category</span>
                <input
                  type="text"
                  value={activeNote.category || ''}
                  onChange={(e) => updateNote(activeNote.id, { category: e.target.value })}
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none border-none p-0 placeholder:text-white/20"
                  placeholder="General"
                />
              </div>

              <div className="flex-1 flex flex-col min-h-[300px]">
                <span className="text-xs text-white/60 font-medium block mb-2 uppercase tracking-wider">Content</span>
                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                  className="flex-1 w-full bg-transparent border-none text-sm text-white/80 font-light leading-relaxed focus:outline-none focus:ring-0 px-0 resize-none placeholder:text-white/20 mb-6"
                  placeholder="Note content..."
                />
              </div>

              {/* Related Items */}
              <div className="border-t border-white/[0.05] pt-6">
                <span className="text-xs text-white/60 font-medium block mb-4 uppercase tracking-wider">Related Context</span>
                <div className="flex flex-col gap-3">
                  {/* Linked Tasks */}
                  {[
                    ...useAppStore.getState().tasks.filter(t => activeNote.linkedTaskIds?.includes(t.id) || t.linkedNoteIds?.includes(activeNote.id))
                  ].map(task => (
                    <div 
                      key={task.id}
                      onClick={() => {
                        setPendingOpen('task', task.id);
                        navigate('/tasks');
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-colors cursor-pointer group"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-400/60" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white/80 font-normal truncate">{task.title}</div>
                        <div className="text-[10px] text-white/30 truncate">Task • {task.status}</div>
                      </div>
                    </div>
                  ))}

                  {/* Linked Notes */}
                  {useAppStore.getState().notes.filter(n => n.id !== activeNote.id && (activeNote.linkedNoteIds?.includes(n.id) || n.linkedNoteIds?.includes(activeNote.id))).map(note => (
                    <div 
                      key={note.id}
                      onClick={() => setActiveNoteId(note.id)}
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
                    ...useAppStore.getState().decisions.filter(d => activeNote.linkedDecisionIds?.includes(d.id) || d.linkedNoteIds?.includes(activeNote.id))
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

                  {activeNote.linkedTaskIds?.length === 0 && activeNote.linkedNoteIds?.length === 0 && activeNote.linkedDecisionIds?.length === 0 && 
                   useAppStore.getState().tasks.filter(t => t.linkedNoteIds?.includes(activeNote.id)).length === 0 &&
                   useAppStore.getState().notes.filter(n => n.linkedNoteIds?.includes(activeNote.id)).length === 0 &&
                   useAppStore.getState().decisions.filter(d => d.linkedNoteIds?.includes(activeNote.id)).length === 0 && (
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
            <h3 className="text-lg font-medium text-white mb-2">Add a Note</h3>
            <p className="text-sm text-white/40 font-light mb-6">Type naturally. The AI will extract the title, content, and category.</p>
            
            <textarea
              value={addText}
              onChange={(e) => setAddText(e.target.value)}
              placeholder="e.g., Had a meeting with the client today. We discussed the new API architecture and decided to use GraphQL..."
              className="w-full h-32 bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-4 text-white text-sm focus:outline-none focus:border-white/20 resize-none mb-6"
              autoFocus
            />

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
                {isExtracting ? 'Extracting...' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomDialog
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={() => {
          if (noteToDelete) {
            deleteNote(noteToDelete);
            setNoteToDelete(null);
          }
        }}
        title="Delete Note"
        message="Are you sure you want to permanently delete this note? This action cannot be undone."
        type="danger"
        confirmLabel="Delete Permanent"
        cancelLabel="Cancel"
      />
    </div>
  );
}
