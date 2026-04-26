import { useState, useEffect } from 'react';

import { GitBranch, X, Trash2, Plus } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { CustomDialog } from '../components/ui/CustomDialog';
import { useAppStore } from '../store';
import { DecisionAddModal } from '../components/decisions/DecisionAddModal';
import { RelatedContext } from '../components/common/RelatedContext';
import type { Decision } from '../store/types';

export function DecisionsPage() {
  const { decisions, updateDecision, deleteDecision, projects, pendingOpenId, pendingOpenType, clearPendingOpen } = useAppStore();
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);
  const [decisionToDelete, setDecisionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (pendingOpenId && pendingOpenType === 'decision') {
      if (pendingOpenId === 'new') {
        setIsAddModalOpen(true);
      } else {
        setActiveDecisionId(pendingOpenId);
      }
      clearPendingOpen();
    }
  }, [pendingOpenId, pendingOpenType, clearPendingOpen]);

  const [filter, setFilter] = useState<string>('All');
  const activeDecision = decisions.find(d => d.id === activeDecisionId);

  const filteredDecisions = decisions.filter(d => filter === 'All' || d.projectId === filter);
  const allProjectIds = Array.from(new Set(decisions.map(d => d.projectId))).filter(Boolean) as string[];

  const openDecision = (decision: Decision) => {
    setActiveDecisionId(decision.id);
  };
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const closeDecision = () => {
    setActiveDecisionId(null);
  };

  return (
    <div className="relative h-full flex overflow-hidden">
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto hide-scrollbar transition-all duration-300">
        {decisions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div
              className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center mb-5"
              style={{
                boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <GitBranch className="w-6 h-6 text-purple-400/60" />
            </div>
            <h2 className="text-lg font-normal text-white mb-2 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              No decisions yet
            </h2>
            <p className="text-sm text-white/40 font-light max-w-sm leading-relaxed">
              Every important decision you make will live here — with your full reasoning preserved. Just tell me about a decision you've made.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/[0.05]"
            >
              <Plus className="w-4 h-4" />
              Log Decision
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-normal text-white tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  Decisions
                </h1>
                <p className="text-sm text-white/40 font-light mt-1 mb-4">{decisions.length} decisions logged</p>
              </div>
              {decisions.length > 0 && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Log Decision
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setFilter('All')}
                  className={`px-3 py-1.5 rounded-full text-xs font-light transition-all border ${
                    filter === 'All' ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-white/40 border-white/[0.05] hover:bg-white/5 hover:text-white/70'
                  }`}
                >
                  All Decisions
                </button>
                {allProjectIds.map(projId => {
                  const proj = projects.find(p => p.id === projId);
                  return (
                    <button
                      key={projId}
                      onClick={() => setFilter(projId)}
                      className={`px-3 py-1.5 rounded-full text-xs font-light transition-all border ${
                        filter === projId ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-white/40 border-white/[0.05] hover:bg-white/5 hover:text-white/70'
                      }`}
                    >
                      {proj?.name || 'Unknown Project'}
                    </button>
                  );
                })}
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
              {[...filteredDecisions].reverse().map((decision) => (
                <div
                  key={decision.id}
                  onClick={() => openDecision(decision)}
                  className={`p-5 rounded-2xl bg-gradient-to-b from-[#1e1e1e] to-[#141414] border-l-2 border-l-purple-500/40 border cursor-pointer hover:border-white/[0.1] transition-all group relative ${activeDecisionId === decision.id ? 'border-white/20 border-l-purple-500' : 'border-white/[0.05]'}`}
                  style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)' }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDecisionToDelete(decision.id);
                    }}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                    title="Delete decision"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <h4 className="text-sm text-white font-normal tracking-tight mb-2 group-hover:text-white/80 transition-colors pr-6">
                    {decision.title}
                  </h4>
                  <p className="text-xs text-white/40 font-light line-clamp-3 leading-relaxed mb-3">
                    <span className="text-white/50">Why:</span> {decision.reasoning}
                  </p>
                  {decision.tradeoffs && (
                    <p className="text-xs text-white/30 font-light line-clamp-1 mb-3">
                      <span className="text-white/40">Tradeoffs:</span> {decision.tradeoffs}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    {projects.find(p => p.id === decision.projectId) && (
                      <span className="text-[10px] text-white/30 font-light px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.05]">
                        {projects.find(p => p.id === decision.projectId)?.name}
                      </span>
                    )}
                    <span className="text-[10px] text-white/30 font-light">
                      {new Date(decision.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Decision Detail Modal */}
      {activeDecision && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={closeDecision}>
          <div 
            className="bg-[#111] border border-white/[0.05] rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 px-5 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-400/80" />
                <span className="text-sm text-white/70 font-medium">Decision Details</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setDecisionToDelete(activeDecision.id);
                    setActiveDecisionId(null);
                  }} 
                  className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors" 
                  title="Delete decision"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={closeDecision} className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 px-6 flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-5">
              <input
                type="text"
                value={activeDecision.title}
                onChange={(e) => updateDecision(activeDecision.id, { title: e.target.value })}
                className="w-full bg-transparent border-none text-xl text-white font-normal focus:outline-none focus:ring-0 px-0 placeholder:text-white/20"
                placeholder="Decision Title"
              />

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="w-20 text-[10px] text-white/40 flex items-center gap-2 font-semibold uppercase tracking-wider">Project</span>
                <CustomSelect
                  value={activeDecision.projectId || 'none'}
                  onChange={(val) => updateDecision(activeDecision.id, { projectId: val === 'none' ? null : val })}
                  options={[
                    { value: 'none', label: 'None' },
                    ...projects.map(p => ({ value: p.id, label: p.name }))
                  ]}
                  className="flex-1"
                  triggerClassName="bg-transparent border-none p-0 text-xs font-normal"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-white/40 font-semibold block mb-2 uppercase tracking-widest">Reasoning</span>
                <textarea
                  value={activeDecision.reasoning}
                  onChange={(e) => updateDecision(activeDecision.id, { reasoning: e.target.value })}
                  className="w-full bg-transparent border-none text-sm text-white/70 font-light leading-relaxed focus:outline-none focus:ring-0 px-0 resize-none min-h-[80px] placeholder:text-white/20"
                  placeholder="Why did you make this decision?"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-semibold block mb-2 uppercase tracking-widest">Tradeoffs</span>
                  <textarea
                    value={activeDecision.tradeoffs || ''}
                    onChange={(e) => updateDecision(activeDecision.id, { tradeoffs: e.target.value })}
                    className="w-full bg-transparent border-none text-sm text-white/70 font-light leading-relaxed focus:outline-none focus:ring-0 px-0 resize-none min-h-[60px] placeholder:text-white/20"
                    placeholder="What did you sacrifice?"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-semibold block mb-2 uppercase tracking-widest">Risks</span>
                  <textarea
                    value={activeDecision.risks || ''}
                    onChange={(e) => updateDecision(activeDecision.id, { risks: e.target.value })}
                    className="w-full bg-transparent border-none text-sm text-white/70 font-light leading-relaxed focus:outline-none focus:ring-0 px-0 resize-none min-h-[60px] placeholder:text-white/20"
                    placeholder="What are the risks?"
                  />
                </div>
              </div>

              <RelatedContext 
                currentId={activeDecision.id}
                currentType="decision"
                linkedTaskIds={activeDecision.linkedTaskIds}
                linkedNoteIds={activeDecision.linkedNoteIds}
                linkedDecisionIds={activeDecision.linkedDecisionIds}
                onLink={(id, type) => {
                  if (type === 'task') {
                    updateDecision(activeDecision.id, { linkedTaskIds: [...(activeDecision.linkedTaskIds || []), id] });
                  } else if (type === 'note') {
                    updateDecision(activeDecision.id, { linkedNoteIds: [...(activeDecision.linkedNoteIds || []), id] });
                  } else if (type === 'decision') {
                    updateDecision(activeDecision.id, { linkedDecisionIds: [...(activeDecision.linkedDecisionIds || []), id] });
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      <DecisionAddModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <CustomDialog
        isOpen={!!decisionToDelete}
        onClose={() => setDecisionToDelete(null)}
        onConfirm={() => {
          if (decisionToDelete) {
            deleteDecision(decisionToDelete);
            setDecisionToDelete(null);
          }
        }}
        title="Delete Decision"
        message="Are you sure you want to permanently delete this decision? This action cannot be undone."
        type="danger"
        confirmLabel="Delete Permanent"
        cancelLabel="Cancel"
      />
    </div>
  );
}
