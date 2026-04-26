import { Lock, Plus, Layers, CheckSquare, Calendar, TrendingUp, Sparkles, FileText, GitBranch, LayoutDashboard, MessageSquare, Search, Home, Inbox, Clock, Briefcase, History, Send, Folder, AudioLines, RefreshCw } from 'lucide-react';

export function Features() {
  return (
    <section id="features" className="z-10 sm:px-6 w-full pt-20 pr-4 pb-32 pl-4 relative animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center mb-16">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-white mb-6"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          Capture everything.
          <br />
          <span className="italic text-white/90 font-serif">— forget nothing.</span>
        </h2>
        <p
          className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed font-light"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          The smart workspace for your professional life. Vela turns your raw thoughts and meetings into a clear record of your progress that grows with you.
        </p>
      </div>

      <div
        className="group transition-transform duration-700 hover:-translate-y-2 bg-gradient-to-b from-[#1e1e1e] to-[#121212] w-full max-w-[1400px] rounded-[2.5rem] mr-auto ml-auto p-[1px] relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
      >
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
        <div
          className="overflow-hidden flex flex-col bg-[#050505] w-full rounded-[2.5rem] relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        >
          {/* Browser Header */}
          <div className="border-white/[0.04] flex z-20 bg-[#0a0a0a]/80 h-11 border-b px-4 relative backdrop-blur-xl items-center">
             <div className="flex gap-2 w-20">
               <div className="w-3 h-3 rounded-full bg-[#ff5f57]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)' }}></div>
               <div className="w-3 h-3 rounded-full bg-[#febc2e]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)' }}></div>
               <div className="w-3 h-3 rounded-full bg-[#28c840]" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)' }}></div>
             </div>
             <div className="mx-auto px-5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/20 flex items-center gap-2 font-light tracking-wide">
               <Lock className="w-2.5 h-2.5 text-white/20" />
               <span>vela.app</span>
             </div>
             <div className="w-20 flex justify-end">
               <Plus className="w-3.5 h-3.5 text-white/20" />
             </div>
          </div>

          <div className="flex h-[760px] relative z-10">
            {/* Sidebar - Design System Inspired Mockup */}
            <div className="hidden md:flex flex-col z-20 bg-[#0a0a0a]/60 backdrop-blur-md w-60 border-r border-white/[0.04] relative">
              <div className="flex items-center gap-2.5 h-[60px] px-5 border-b border-white/[0.04]">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-[#333] to-[#111] flex items-center justify-center text-white border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-white text-[13px] font-normal tracking-tight">Vela</span>
              </div>

              <div className="px-3 pt-4 pb-2 flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 text-[11px] font-medium tracking-tight">
                  <Layers className="w-3 h-3" />
                  Projects
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 text-[10px] font-mono">
                  <Search className="w-3 h-3" />
                  <span className="opacity-50">⌘K</span>
                </div>
              </div>

              <nav className="flex flex-col gap-0.5 px-3 pt-2">
                {[
                  { label: 'Home', icon: Home, active: true },
                  { label: 'Inbox', icon: Inbox },
                  { label: 'Tasks', icon: CheckSquare },
                  { label: 'Notes', icon: FileText },
                  { label: 'Decisions', icon: GitBranch },
                  { label: 'Reflections', icon: RefreshCw },
                  { label: 'Timeline', icon: Clock },
                  { label: 'Portfolio', icon: Briefcase },
                ].map((item) => (
                  <div 
                    key={item.label}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${item.active ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/[0.05]' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.02]'}`}
                  >
                    <item.icon className={`w-4 h-4 ${item.active ? 'text-white' : ''}`} />
                    <span className="tracking-tight font-light">{item.label}</span>
                  </div>
                ))}
              </nav>

              <div className="mt-6 px-5 py-2">
                <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium">Recent Streams</span>
              </div>
              <div className="px-3 space-y-0.5">
                {['Synthesizing roadmap...', 'Quarterly review prep', 'New design system specs'].map((chat, i) => (
                  <div key={i} className="px-3 py-2 text-xs text-white/30 font-light truncate hover:bg-white/5 rounded-lg cursor-pointer">
                    {chat}
                  </div>
                ))}
              </div>

              <div className="mt-auto p-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#555] to-[#222] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] overflow-hidden flex items-center justify-center text-[10px] text-white/40">
                    JD
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white font-medium">John Doe</span>
                    <span className="text-[9px] text-white/30">Lead Architect</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area - Mockup Content */}
            <div className="flex-1 bg-transparent overflow-y-auto relative hide-scrollbar">
              <div className="max-w-4xl mx-auto px-8 pt-16 pb-20">
                {/* Large Greeting */}
                <h1 className="text-5xl font-light text-white tracking-tight mb-10 leading-tight">
                  Good morning, <span className="font-semibold">John.</span>
                </h1>

                {/* Recent Chat Pill */}
                <div className="inline-flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.05] px-3.5 py-2 rounded-full mb-6 cursor-pointer hover:bg-white/[0.06] transition-all">
                  <History className="w-3.5 h-3.5 text-white/30" />
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-white/30 font-medium">Recent Memory</span>
                    <span className="text-white/10">•</span>
                    <span className="text-white/70 font-medium">Architecture review for Q3...</span>
                  </div>
                </div>

                {/* Message Input Box */}
                <div 
                  className="w-full rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.9)] mb-12"
                >
                  <div 
                    className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-2px_6px_rgba(0,0,0,0.8)] overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
                    <span className="text-lg text-white/20 font-light tracking-tight">Capture your progress...</span>
                    
                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-white/40 bg-white/5 border border-white/5">
                           <Plus className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/30 text-[10px] font-medium">
                           <Folder className="w-3 h-3" />
                           Design System
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <AudioLines className="w-4.5 h-4.5 text-white/30" />
                         <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#333] to-[#1a1a1a] flex items-center justify-center border border-white/10 shadow-lg">
                           <Send className="w-3.5 h-3.5 text-white/40" />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks Section */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xl text-white font-medium tracking-tight">Today's Focus</h3>
                      <span className="bg-white/5 text-white/30 text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                       <span>View All &gt;</span>
                       <Plus className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      { title: 'Refine skeuomorphic component tokens', date: 'Overdue', color: 'text-red-500/80' },
                      { title: 'Prepare documentation for client sync', date: 'Today', color: 'text-amber-500/80' },
                      { title: 'Initial draft of quarterly impact report', date: 'Tomorrow', color: 'text-white/20' },
                    ].map((task, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-white/[0.02] pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 rounded-full border border-white/10 group-hover:border-white/30 transition-all shadow-inner" />
                          <span className="text-sm text-white/80 font-light group-hover:text-white transition-colors">{task.title}</span>
                        </div>
                        <span className={`text-[11px] font-medium ${task.color}`}>{task.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
