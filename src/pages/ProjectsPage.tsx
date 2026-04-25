import { useState } from 'react';
import { Layers, Plus, Hash, Folder, ChevronRight, ChevronDown, Trash2, X, Info } from 'lucide-react';
import { useAppStore } from '../store';
import type { Project } from '../store/types';
import { v4 as uuidv4 } from 'uuid';
import { CustomDialog } from '../components/ui/CustomDialog';

export function ProjectsPage() {
  const { projects, addProject, deleteProject } = useAppStore();
  const [isCreating, setIsCreating] = useState<string | null>(null); // parentId or 'root'
  const [newProjectName, setNewProjectName] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedIds(next);
  };

  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    
    const parentId = isCreating === 'root' ? null : isCreating;
    const project: Project = {
      id: uuidv4(),
      name: newProjectName.trim(),
      parentId,
      type: !parentId ? 'category' : 'project',
      createdAt: new Date().toISOString(),
    };

    await addProject(project);
    setNewProjectName('');
    setIsCreating(null);
    if (parentId) {
      const next = new Set(expandedIds);
      next.add(parentId);
      setExpandedIds(next);
    }
  };

  const renderProjectCard = (project: Project, depth = 0) => {
    const children = projects.filter(p => p.parentId === project.id);
    const isExpanded = expandedIds.has(project.id);
    const isCategory = project.type === 'category';

    return (
      <div key={project.id} className="flex flex-col">
        <div 
          className={`group flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.05] relative transition-all duration-300 hover:border-white/[0.1] hover:-translate-y-0.5`}
          style={{ 
            marginLeft: `${depth * 24}px`,
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8), 0 24px 48px -12px rgba(0,0,0,0.9)' 
          }}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
               {children.length > 0 && (
                 <button onClick={() => toggleExpand(project.id)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                   {isExpanded ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
                 </button>
               )}
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all
                 ${isCategory ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}
               `}>
                 {isCategory ? <Folder className="w-5 h-5" strokeWidth={1.5} /> : <Hash className="w-5 h-5" strokeWidth={1.5} />}
               </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-normal text-white/90 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{project.name}</h3>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">{isCategory ? 'Main Project' : 'Project'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button 
              onClick={() => setIsCreating(project.id)}
              className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              title="Add Sub-project"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => setDeleteId(project.id)}
              className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {isExpanded && children.length > 0 && (
          <div className="flex flex-col gap-3 mt-3">
            {children.map(child => renderProjectCard(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootProjects = projects.filter(p => !p.parentId);

  if (isCreating) {
    const parentProject = isCreating === 'root' ? null : projects.find(p => p.id === isCreating);
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="max-w-2xl w-full flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-normal text-white tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
              Create a {parentProject ? 'sub-project' : 'project'}
            </h1>
            <button 
              onClick={() => setIsCreating(null)}
              className="p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Claude-inspired Tip Box */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-3 relative overflow-hidden"
            style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03)' }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Layers className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-2 text-white/60 font-medium text-sm">
              <Info className="w-4 h-4 text-blue-400" />
              How to use projects
            </div>
            <p className="text-sm text-white/40 font-light leading-relaxed">
              Projects help organize your work and leverage knowledge across multiple conversations. 
              {parentProject ? ` This will be nested under "${parentProject.name}".` : ' Start by creating a memorable title to organize your context.'}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/30 uppercase tracking-[0.2em]">What are you working on?</label>
              <input
                autoFocus
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder={parentProject ? "Sub-project name..." : "Project name..."}
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-2xl px-5 py-4 text-lg text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-white/10 font-light"
                style={{ boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.5)' }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button 
                onClick={() => setIsCreating(null)} 
                className="px-6 py-3 text-sm text-white/30 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                disabled={!newProjectName.trim()}
                className="px-8 py-3 rounded-2xl bg-gradient-to-b from-[#2e2e2e] to-[#141414] text-white text-sm font-medium transition-all shadow-[0_12px_24px_-6px_rgba(0,0,0,0.9)] active:scale-[0.98] hover:-translate-y-0.5 border border-white/[0.05] disabled:opacity-30 disabled:pointer-events-none"
                style={{ boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.9)' }}
              >
                Create {parentProject ? 'Sub-project' : 'Project'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden p-6 lg:p-10 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto w-full flex flex-col min-h-0 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-normal text-white tracking-tight flex items-center gap-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center border border-white/[0.05]"
                style={{ boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)' }}
              >
                <Layers className="w-6 h-6 text-white/40" strokeWidth={1.5} />
              </div>
              Projects
            </h1>
            <p className="text-sm text-white/30 font-light leading-relaxed">
              Organize your workspace into focused projects for better context tracking and AI intelligence.
            </p>
          </div>
          {rootProjects.length > 0 && (
            <button 
              onClick={() => setIsCreating('root')}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-[#2e2e2e] to-[#141414] text-white hover:from-[#3a3a3a] hover:to-[#1a1a1a] rounded-2xl text-sm font-medium transition-all shadow-[0_12px_24px_-6px_rgba(0,0,0,0.9)] active:scale-[0.98] hover:-translate-y-0.5 border border-white/[0.05]"
              style={{ boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.9)' }}
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" strokeWidth={1.5} />
              New Project
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-4 hide-scrollbar flex flex-col gap-4 pb-20 h-full">
          {rootProjects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center mb-5"
                 style={{
                   boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)',
                   border: '1px solid rgba(255,255,255,0.06)',
                 }}
               >
                 <Layers className="w-6 h-6 text-white/50" />
               </div>
               <h2 className="text-lg font-normal text-white mb-2 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                 No projects yet
               </h2>
               <p className="text-sm text-white/40 font-light max-w-sm leading-relaxed">
                 Start by creating a project to organize your context. You can link tasks, notes, and decisions to keep everything focused.
               </p>
               <button
                 onClick={() => setIsCreating('root')}
                 className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/[0.05]"
               >
                 <Plus className="w-4 h-4" />
                 New Project
               </button>
            </div>
          ) : (
            rootProjects.map(p => renderProjectCard(p))
          )}
        </div>
      </div>

      <CustomDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteProject(deleteId)}
        title="Delete Project"
        message="Are you sure you want to delete this project and all its sub-projects? This action cannot be undone."
        type="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
