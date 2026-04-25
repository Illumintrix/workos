import { Lock, Plus, Layers, CheckSquare, Calendar, MoreHorizontal, TrendingUp, Sparkles, FileText, GitBranch, LayoutDashboard, MessageSquare } from 'lucide-react';

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
          <span className="italic text-white/90 font-serif">— recall anything.</span>
        </h2>
        <p
          className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed font-light"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          An autonomous brain for your career. Vela transforms your raw thoughts and meetings into a structured knowledge graph that evolves with you.
        </p>
      </div>

      <div
        className="group transition-transform duration-700 hover:-translate-y-2 bg-gradient-to-b from-[#1e1e1e] to-[#121212] w-full max-w-[1400px] rounded-[2rem] mr-auto ml-auto p-[1px] relative"
        style={{ boxShadow: '0 24px 48px -12px rgba(0,0,0,0.9)' }}
      >
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
        <div
          className="overflow-hidden flex flex-col bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] w-full rounded-[2rem] relative"
          style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '4px 4px' }}
          ></div>

          {/* Browser Header */}
          <div className="border-white/[0.04] flex z-20 bg-[#0a0a0a]/50 h-12 border-b px-4 relative backdrop-blur-md items-center shadow-sm">
             <div className="flex gap-1.5 w-20">
               <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)' }}></div>
               <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)' }}></div>
               <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)' }}></div>
             </div>
             <div className="mx-auto px-6 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-xs text-white/40 flex items-center gap-2 font-light tracking-wide shadow-inner">
               <Lock className="w-3 h-3 text-white/50" />
               <span>vela.app</span>
             </div>
             <div className="w-20 flex justify-end">
               <Plus className="w-4 h-4 text-white/40" />
             </div>
          </div>

          <div className="flex h-[800px] relative z-10">
            {/* Sidebar */}
            <div className="hidden md:flex border-white/[0.04] flex-col gap-6 z-20 bg-[#0a0a0a]/30 backdrop-blur-md w-64 border-r p-5 relative">
              <div className="flex items-center gap-3 px-2">
                <div
                  className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#333] to-[#111] flex items-center justify-center text-white border border-[#333]"
                  style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.5)' }}
                >
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-white text-sm font-normal tracking-tight">Intelligence OS</span>
              </div>

                <div className="flex flex-col gap-1 mt-2">
                  {[
                    { label: 'Today', icon: LayoutDashboard },
                    { label: 'Inbox', icon: MessageSquare },
                    { label: 'Tasks', icon: CheckSquare },
                    { label: 'Notes', icon: FileText },
                    { label: 'Decisions', icon: GitBranch },
                    { label: 'Reflections', icon: Sparkles },
                    { label: 'Timeline', icon: Calendar },
                    { label: 'Portfolio', icon: TrendingUp },
                  ].map((item, idx) => (
                    <div 
                      key={item.label}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer font-light transition-all ${idx === 0 ? 'bg-white/[0.05] text-white border border-white/[0.05]' : 'text-white/50 hover:bg-white/[0.02] hover:text-white'}`}
                      style={idx === 0 ? { boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-white/70" />
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

              <div className="mt-auto pt-5 border-t border-white/[0.04]">
                <div className="flex items-center gap-3 px-2">
                  <img
                    src="https://images.unsplash.com/photo-1724525647065-f948fc102e68?w=150&q=80"
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover border border-white/10 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-normal tracking-tight">Rahul</span>
                    <span className="text-xs text-white/50 font-light mt-0.5">Knowledge Architect</span>
                  </div>
                  <button className="ml-auto text-white/40 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-transparent p-6 md:p-8 overflow-y-auto relative hide-scrollbar">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl md:text-2xl text-white font-normal tracking-tight shadow-sm">My Feed</h3>
                    <span className="px-2.5 py-1 rounded-full border border-white/[0.05] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] text-xs text-white/70" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}>Active</span>
                  </div>
                  <p className="text-sm text-white/50 font-light drop-shadow-sm">Tracking 14 entities in your career memory</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-xs text-white bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] hover:from-[#444] hover:to-[#222] rounded-lg border border-white/[0.1] transition-colors font-light flex items-center gap-2 shadow-lg" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.5)' }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Synthesize Impact
                  </button>
                </div>
              </div>

              {/* Feed Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Decision Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/[0.05] group hover:border-white/10 transition-all" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <span className="text-xs text-white/70 font-medium">Decision Extracted</span>
                    </div>
                    <span className="text-[10px] text-white/30">Just now</span>
                  </div>
                  <h4 className="text-sm text-white font-normal mb-2 tracking-tight">Migrate to Supabase for Auth</h4>
                  <p className="text-xs text-white/50 font-light leading-relaxed mb-4">Automatically identified from #engineering-sync. Linked to 4 related tasks and 2 technical risks.</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/[0.03]">
                    <div className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40">#infrastructure</div>
                    <div className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/40">#security</div>
                  </div>
                </div>

                {/* Task Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/[0.05] group hover:border-white/10 transition-all" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-xs text-white/70 font-medium">Task Spawned</span>
                    </div>
                    <span className="text-[10px] text-white/30">10:15 AM</span>
                  </div>
                  <h4 className="text-sm text-white font-normal mb-2 tracking-tight">Implement Edge Function Caching</h4>
                  <p className="text-xs text-white/50 font-light leading-relaxed mb-4">Critical path task extracted from "Performance Optimization" note.</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                    <div className="flex items-center -space-x-1.5">
                      <div className="w-6 h-6 rounded-full border border-[#1a1a1a] bg-gray-500 flex items-center justify-center text-[10px]">JD</div>
                    </div>
                    <div className="flex items-center gap-2">
                       <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />
                       <span className="text-[10px] text-white/30">Analyzing Impact...</span>
                    </div>
                  </div>
                </div>

                {/* Impact Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/[0.1] group hover:border-white/20 transition-all md:col-span-2" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                        <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
                      </div>
                      <span className="text-xs text-white/70 font-medium">Synthesis Ready</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-pink-500/10 text-[10px] text-pink-400 border border-pink-500/20 animate-pulse">New Milestone</div>
                  </div>
                  <h4 className="text-base text-white font-normal mb-2 tracking-tight">Led transition to Edge Architecture</h4>
                  <p className="text-xs text-white/50 font-light leading-relaxed mb-4">Vela has synthesized 12 tasks, 3 decisions, and 8 notes into a high-level portfolio entry. This represents a 40% reduction in TTI.</p>
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/70 border border-white/10 transition-all font-light">Add to Portfolio</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
