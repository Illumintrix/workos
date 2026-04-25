import { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, Loader2, ArrowRight, ArrowLeft, Smile, Meh, Frown, Star, Zap, Target, BookOpen, Lightbulb, X, Folder, Trash2 } from 'lucide-react';
import { useAppStore } from '../store';
import { generateWeeklyReflection } from '../engine/aiEngine';
import { v4 as uuidv4 } from 'uuid';
import { AmbientBackground } from '../components/AmbientBackground';
import { CustomDialog } from '../components/ui/CustomDialog';
import ReactMarkdown from 'react-markdown';
import type { Reflection } from '../store/types';

function ReflectionCard({ reflection, onClick, onDelete }: { reflection: Reflection; onClick: () => void; onDelete?: () => void }) {
  const { projects } = useAppStore();
  const project = projects.find(p => p.id === reflection.projectId);
  
  return (
    <div
      onClick={onClick}
      className="p-5 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] border border-white/[0.05] group transition-all cursor-pointer hover:border-white/[0.1] hover:-translate-y-1 relative"
      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.3)' }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 z-10"
        title="Delete reflection"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
            <RefreshCw className="w-4 h-4 text-amber-400/60" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-white font-medium tracking-tight">
              {new Date(reflection.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-[9px] text-white/30 uppercase tracking-[0.2em]">
              {reflection.type}
            </span>
          </div>
        </div>
        <div className="px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center gap-1.5">
          <Star className="w-2.5 h-2.5 text-purple-400/60" />
          <span className="text-[10px] font-medium text-white/50">{reflection.moodScore}/10</span>
        </div>
      </div>

      <p className="text-xs text-white/50 font-light line-clamp-3 leading-relaxed mb-4 italic">
        {reflection.summary.replace(/[#*`]/g, '').slice(0, 150)}...
      </p>

      {project && (
        <div className="flex items-center gap-1.5 pt-3 border-t border-white/[0.03]">
          <Folder className="w-3 h-3 text-white/20" />
          <span className="text-[10px] text-white/30 font-light">{project.name}</span>
        </div>
      )}
    </div>
  );
}

export function ReflectionsPage() {
  const { reflections, addReflection, deleteReflection, tasks, decisions, selectedProjectId, projects, pendingOpenId, pendingOpenType, clearPendingOpen } = useAppStore();
  const [isReflecting, setIsReflecting] = useState(false);
  const [activeReflectionId, setActiveReflectionId] = useState<string | null>(null);
  const [reflectionToDelete, setReflectionToDelete] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const activeReflection = reflections.find(r => r.id === activeReflectionId);

  useEffect(() => {
    if (pendingOpenId && pendingOpenType === 'reflection') {
      if (pendingOpenId === 'new') {
        setIsReflecting(true);
      } else {
        setActiveReflectionId(pendingOpenId);
      }
      clearPendingOpen();
    }
  }, [pendingOpenId, pendingOpenType, clearPendingOpen]);
  
  interface Answers {
    wins: string;
    challenges: string;
    learnings: string;
    improvements: string;
    moodScore: number;
  }

  const [answers, setAnswers] = useState<Answers>({
    wins: '',
    challenges: '',
    learnings: '',
    improvements: '',
    moodScore: 7
  });

  const currentProject = projects.find(p => p.id === selectedProjectId);

  const questions: { key: keyof Answers; title: string; subtitle: string; placeholder?: string; icon: React.ReactNode; color: string; type?: string }[] = [
    { 
      key: 'wins', 
      title: "What went well this week?", 
      subtitle: "Focus on the positive. No matter how small.",
      placeholder: "List your wins...", 
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      color: "emerald"
    },
    { 
      key: 'challenges', 
      title: "What was harder than expected?", 
      subtitle: "Identify the friction. What slowed you down?",
      placeholder: "List your challenges...", 
      icon: <Zap className="w-6 h-6 text-red-400" />,
      color: "red"
    },
    { 
      key: 'learnings', 
      title: "What did you learn?", 
      subtitle: "Every week is an opportunity to grow.",
      placeholder: "New insights or skills...", 
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      color: "blue"
    },
    { 
      key: 'improvements', 
      title: "What's the one thing to change?", 
      subtitle: "Actionable improvement for next week.",
      placeholder: "Your focus for next week...", 
      icon: <Lightbulb className="w-6 h-6 text-amber-400" />,
      color: "amber"
    },
    { 
      key: 'moodScore', 
      title: "Overall, how was your energy?", 
      subtitle: "Rate your state of mind this week.",
      type: 'mood',
      icon: <Smile className="w-6 h-6 text-purple-400" />,
      color: "purple"
    }
  ];

  const handleNext = async () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setIsGenerating(true);
      
      const highlights = {
        tasks: tasks.filter(t => t.projectId === selectedProjectId && t.status === 'completed'),
        decisions: decisions.filter(d => d.projectId === selectedProjectId)
      };

      const context = `
Project: ${currentProject?.name || 'General'}
Completed Tasks: ${highlights.tasks.map(t => t.title).join(', ')}
Key Decisions: ${highlights.decisions.map(d => d.title).join(', ')}
Wins: ${answers.wins}
Challenges: ${answers.challenges}
Learnings: ${answers.learnings}
Improvements: ${answers.improvements}
Mood Score: ${answers.moodScore}/10`;
      
      try {
        const summary = await generateWeeklyReflection(context);
        
        const newReflection: Reflection = {
          id: uuidv4(),
          type: 'manual',
          summary,
          wins: answers.wins.split('\n').filter(s => s.trim()),
          challenges: answers.challenges.split('\n').filter(s => s.trim()),
          learnings: answers.learnings.split('\n').filter(s => s.trim()),
          improvements: answers.improvements.split('\n').filter(s => s.trim()),
          moodScore: answers.moodScore,
          projectId: selectedProjectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await addReflection(newReflection);
        
        setIsReflecting(false);
        setStep(0);
        setAnswers({ wins: '', challenges: '', learnings: '', improvements: '', moodScore: 7 });
        setActiveReflectionId(newReflection.id);
      } catch (e) {
        console.error("Failed to generate reflection", e);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (isReflecting) {
    const currentQ = questions[step];
    const progress = ((step + 1) / questions.length) * 100;

    return (
      <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
        <AmbientBackground />
        
        <div className="absolute top-0 left-0 h-1 bg-white/[0.03] w-full overflow-hidden z-20">
          <div 
            className="h-full bg-white transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-4xl mx-auto w-full relative z-10">
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center text-center mb-12">
              <div 
                className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.08] mb-8 shadow-2xl backdrop-blur-xl"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)' }}
              >
                {currentQ.icon}
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/30 mb-3 block">Step {step + 1} of {questions.length}</span>
              <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight leading-tight">
                {currentQ.title}
              </h2>
              <p className="text-white/40 font-light mt-3 text-base sm:text-lg">{currentQ.subtitle}</p>
            </div>

            {currentQ.type === 'mood' ? (
              <div className="flex flex-col items-center gap-12 py-10">
                <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setAnswers({ ...answers, moodScore: num })}
                      className={`
                        w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-light transition-all duration-300
                        ${answers.moodScore === num 
                          ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-110' 
                          : 'bg-white/[0.03] text-white/30 border border-white/[0.05] hover:bg-white/[0.08] hover:text-white/60'}
                      `}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex gap-16 sm:gap-24 text-white/20">
                  <div className={`flex flex-col items-center gap-3 transition-colors duration-500 ${answers.moodScore <= 3 ? 'text-red-400/60' : ''}`}>
                    <Frown className="w-8 h-8 font-light" strokeWidth={1} />
                    <span className="text-[10px] uppercase tracking-widest font-medium">Low Energy</span>
                  </div>
                  <div className={`flex flex-col items-center gap-3 transition-colors duration-500 ${answers.moodScore > 3 && answers.moodScore <= 7 ? 'text-purple-400/60' : ''}`}>
                    <Meh className="w-8 h-8 font-light" strokeWidth={1} />
                    <span className="text-[10px] uppercase tracking-widest font-medium">Neutral</span>
                  </div>
                  <div className={`flex flex-col items-center gap-3 transition-colors duration-500 ${answers.moodScore > 7 ? 'text-emerald-400/60' : ''}`}>
                    <Smile className="w-8 h-8 font-light" strokeWidth={1} />
                    <span className="text-[10px] uppercase tracking-widest font-medium">Peak State</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent rounded-[32px] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                <textarea
                  autoFocus
                  value={answers[currentQ.key] as string}
                  onChange={(e) => setAnswers({ ...answers, [currentQ.key]: e.target.value })}
                  placeholder={currentQ.placeholder}
                  className="relative w-full bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/[0.1] rounded-[32px] p-10 text-white text-xl sm:text-2xl font-light leading-relaxed min-h-[320px] focus:outline-none focus:border-white/20 transition-all resize-none shadow-2xl"
                  style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
                />
                <p className="absolute bottom-8 right-10 text-[11px] text-white/20 font-light tracking-wide italic">
                  Shift + Enter for new lines
                </p>
              </div>
            )}
            
            <div className="mt-16 flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={step === 0 || isGenerating}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white/30 hover:text-white hover:bg-white/5 transition-all disabled:opacity-0 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium tracking-wide">Previous</span>
              </button>

              <div className="flex gap-4">
                {step < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="group px-10 py-4 bg-white text-black text-base font-medium rounded-2xl hover:bg-white/90 transition-all flex items-center gap-3 shadow-2xl active:scale-95"
                  >
                    <span className="tracking-tight">Next Step</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={isGenerating}
                    className="group px-10 py-4 bg-white text-black text-base font-semibold rounded-2xl hover:bg-white/90 transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-black/50" />
                        <span className="tracking-tight">Synthesizing Pulse...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span className="tracking-tight">Complete Reflection</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full flex overflow-hidden bg-[#050505]">
      <AmbientBackground />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto hide-scrollbar z-10">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-normal text-white tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              Reflections
            </h1>
            <p className="text-sm text-white/40 font-light mt-1">Reviewing your growth trajectory.</p>
          </div>
          
          {reflections.length > 0 && (
            <button
              onClick={() => setIsReflecting(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors border border-white/[0.05]"
            >
              <Sparkles className="w-4 h-4 text-purple-400/60" />
              New Reflection
            </button>
          )}
        </div>

        {reflections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 animate-in fade-in duration-700">
            <div
              className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center mb-5"
              style={{
                boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.12), inset 0 -2px 6px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <RefreshCw className="w-6 h-6 text-purple-400/60" />
            </div>
            <h2 className="text-lg font-normal text-white mb-2 tracking-tight" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              The Weekly Pulse
            </h2>
            <p className="text-sm text-white/40 font-light max-w-sm leading-relaxed">
              Self-reflection is the key to velocity. Log your first guided reflection to see your week in focus.
            </p>
            <button
              onClick={() => setIsReflecting(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-all border border-white/[0.05]"
            >
              <Sparkles className="w-4 h-4 text-purple-400/60" />
              Start Guided Reflection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {[...reflections].reverse().map((reflection) => (
                <ReflectionCard
                  key={reflection.id}
                  reflection={reflection}
                  onClick={() => setActiveReflectionId(reflection.id)}
                  onDelete={() => setReflectionToDelete(reflection.id)}
                />
            ))}
          </div>
        )}
      </div>


      {activeReflection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="w-full max-w-4xl bg-[#0a0a0a]/90 border border-white/[0.08] rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
            style={{ boxShadow: '0 32px 64px -16px rgba(0,0,0,0.8)' }}
          >
            <div className="p-8 pb-4 flex items-center justify-between border-b border-white/[0.05]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.08]">
                  <RefreshCw className="w-6 h-6 text-white/40" strokeWidth={1} />
                </div>
                <div>
                  <h3 className="text-xl font-light text-white tracking-tight">
                    {new Date(activeReflection.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <span className="text-[10px] text-white/20 uppercase tracking-[0.3em]">
                    {new Date(activeReflection.createdAt).toLocaleDateString('en-US', { weekday: 'long' })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setReflectionToDelete(activeReflection.id);
                    setActiveReflectionId(null);
                  }}
                  className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all group"
                  title="Delete reflection"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveReflectionId(null)}
                  className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-400/60" />
                    <span className="text-xs font-medium text-white/60 tracking-wider">{activeReflection.moodScore}/10 ENERGY</span>
                  </div>
                </div>
                {activeReflection.projectId && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]">
                    <Folder className="w-3.5 h-3.5 text-white/20" />
                    <span className="text-xs font-medium text-white/40">{projects.find(p => p.id === activeReflection.projectId)?.name}</span>
                  </div>
                )}
              </div>

              <div className="relative mb-12">
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                <div className="pl-8 text-white/90 font-light leading-relaxed prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{activeReflection.summary}</ReactMarkdown>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/[0.05]">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80 font-semibold">Wins</span>
                  </div>
                  <ul className="space-y-3 pl-1">
                    {activeReflection.wins.map((w, i) => (
                      <li key={i} className="text-xs text-white/40 font-light leading-relaxed flex gap-3">
                        <span className="text-white/20 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-red-400" />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-red-400/80 font-semibold">Friction</span>
                  </div>
                  <ul className="space-y-3 pl-1">
                    {activeReflection.challenges.map((c, i) => (
                      <li key={i} className="text-xs text-white/40 font-light leading-relaxed flex gap-3">
                        <span className="text-white/20 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-blue-400/80 font-semibold">Insights</span>
                  </div>
                  <ul className="space-y-3 pl-1">
                    {activeReflection.learnings.map((l, i) => (
                      <li key={i} className="text-xs text-white/40 font-light leading-relaxed flex gap-3">
                        <span className="text-white/20 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-amber-400/80 font-semibold">Adjustments</span>
                  </div>
                  <ul className="space-y-3 pl-1">
                    {activeReflection.improvements?.map((imp, i) => (
                      <li key={i} className="text-xs text-white/40 font-light leading-relaxed flex gap-3">
                        <span className="text-white/20 mt-1.5 w-1 h-1 rounded-full bg-current shrink-0" />
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CustomDialog
        isOpen={!!reflectionToDelete}
        onClose={() => setReflectionToDelete(null)}
        onConfirm={() => {
          if (reflectionToDelete) {
            deleteReflection(reflectionToDelete);
            setReflectionToDelete(null);
          }
        }}
        title="Delete Reflection"
        message="Are you sure you want to permanently delete this reflection? This action cannot be undone."
        type="danger"
        confirmLabel="Delete Permanent"
        cancelLabel="Cancel"
      />
    </div>
  );
}
