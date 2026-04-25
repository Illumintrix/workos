import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, Plus, Trash2, Hash } from 'lucide-react';
import { useAppStore } from '../../store';
import type { Project } from '../../store/types';
import { v4 as uuidv4 } from 'uuid';
import { CustomDialog } from '../ui/CustomDialog';

interface ProjectTreeProps {
  isCollapsed: boolean;
}

export function ProjectTree({ isCollapsed }: ProjectTreeProps) {
  const { projects, selectedProjectId, setSelectedProjectId, addProject, deleteProject } = useAppStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isAddingProject, setIsAddingProject] = useState<string | null>(null); // parentId or 'root'
  const [newProjectName, setNewProjectName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean, id: string | null }>({ show: false, id: null });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedIds(newExpanded);
  };

  const handleAddProject = async (parentId: string | null) => {
    if (!newProjectName.trim()) return;
    
    const project: Project = {
      id: uuidv4(),
      name: newProjectName.trim(),
      parentId,
      type: parentId ? 'project' : 'category',
      createdAt: new Date().toISOString(),
    };

    await addProject(project);
    setNewProjectName('');
    setIsAddingProject(null);
    if (parentId) {
      const newExpanded = new Set(expandedIds);
      newExpanded.add(parentId);
      setExpandedIds(newExpanded);
    }
  };

  const renderProject = (project: Project, depth = 0) => {
    const children = projects.filter(p => p.parentId === project.id);
    const isExpanded = expandedIds.has(project.id);
    const isSelected = selectedProjectId === project.id;

    return (
      <div key={project.id} className="flex flex-col">
        <div
          onClick={() => setSelectedProjectId(project.id)}
          className={`
            group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all
            ${isSelected ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'}
          `}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {children.length > 0 ? (
            <button onClick={(e) => toggleExpand(project.id, e)} className="p-0.5 hover:bg-white/10 rounded transition-colors">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <div className="w-3.5" />
          )}
          
          {project.type === 'category' ? (
            <Folder className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-white/30'}`} />
          ) : (
            <Hash className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-white/20'}`} />
          )}

          {!isCollapsed && (
            <>
              <span className="flex-1 truncate text-sm font-light tracking-wide">{project.name}</span>
              <div className="hidden group-hover:flex items-center gap-1">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsAddingProject(project.id);
                    const newExpanded = new Set(expandedIds);
                    newExpanded.add(project.id);
                    setExpandedIds(newExpanded);
                  }}
                  className="p-1 hover:text-white/80 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ show: true, id: project.id }); }}
                  className="p-1 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>

        {isExpanded && !isCollapsed && (
          <div className="flex flex-col">
            {children.map(child => renderProject(child, depth + 1))}
            {isAddingProject === project.id && (
              <div className="flex items-center gap-2 px-2 py-1.5" style={{ paddingLeft: `${(depth + 1) * 12 + 28}px` }}>
                <input
                  autoFocus
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddProject(project.id)}
                  onBlur={() => setIsAddingProject(null)}
                  placeholder="Sub-project..."
                  className="bg-transparent text-sm text-white/90 focus:outline-none w-full border-b border-white/10"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const rootProjects = projects.filter(p => !p.parentId);

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 border-t border-white/[0.04]">
        <button 
          onClick={() => setSelectedProjectId(null)}
          className={`p-2 rounded-xl transition-all ${!selectedProjectId ? 'bg-white/10 text-white' : 'text-white/30'}`}
        >
          <Folder className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-4 border-t border-white/[0.04]">
      <div className="flex items-center justify-between px-3 mb-2">
        <span className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em]">Projects</span>
        <button 
          onClick={() => setIsAddingProject('root')}
          className="p-1 text-white/20 hover:text-white/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div 
        onClick={() => setSelectedProjectId(null)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all mb-1
          ${!selectedProjectId ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'}
        `}
      >
        <Folder className={`w-4 h-4 ${!selectedProjectId ? 'text-blue-400' : 'text-white/30'}`} />
        <span className="text-sm font-light tracking-wide">All Items</span>
      </div>

      {rootProjects.map(p => renderProject(p))}

      {isAddingProject === 'root' && (
        <div className="px-3 py-1.5 flex flex-col gap-2">
          <input
            autoFocus
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddProject(null)}
            onBlur={() => setIsAddingProject(null)}
            placeholder="Category name..."
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/20"
          />
        </div>
      )}

      <CustomDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={() => deleteConfirm.id && deleteProject(deleteConfirm.id)}
        title="Delete Project"
        message="Are you sure you want to delete this project and all its sub-projects? This action cannot be undone."
        type="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
