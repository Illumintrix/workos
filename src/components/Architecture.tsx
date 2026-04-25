import { Bell, Sidebar, ChevronLeft, ChevronRight, LayoutDashboard, GitBranch, Briefcase, FileText, RefreshCw } from 'lucide-react';

export function Architecture() {
  return (
    <>
      {/* Architecture Section */}
      <section id="architecture" className="sm:px-6 sm:pt-32 sm:pb-32 w-full z-10 pt-16 pr-4 pb-16 pl-4 relative animate-in fade-in duration-700">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.1] text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            Streamline your
            <br />
            <span className="italic font-light text-white/90 font-serif">— career intelligence.</span>
          </h2>
          <p
            className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed font-light animate-in fade-in slide-in-from-bottom-6 duration-1000"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            A holistic approach to work management. Vela automatically synthesizes your daily actions into a high-fidelity narrative of your professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_auto] gap-5 max-w-[1080px] mx-auto">
          {/* Intelligent Boards */}
          <div
            className="md:col-span-1 md:row-span-2 rounded-[2rem] bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-[1px] relative group transition-all duration-500 hover:-translate-y-1"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.9) 0px 24px 48px -12px' }}
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
            <div
              className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden p-8 flex flex-col gap-8"
              style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}
            >
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              ></div>
              <div className="relative z-10 flex flex-col h-full gap-8">
                <div>
                  <h3
                    className="text-lg md:text-xl font-normal tracking-tight text-white mb-2"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    Start Your Synthesis
                  </h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed">
                    Automatically link tasks, notes, and decisions into a unified brain.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-6 mt-auto">
                  {/* Mock Folder 1: Decisions */}
                  <div className="flex flex-col items-center gap-2 group/folder cursor-default">
                    <div className="relative">
                      <div className="w-14 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 group-hover/folder:bg-indigo-500/30 transition-all">
                        <GitBranch className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center text-white">84</div>
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] text-white/70 block font-medium">Decisions</span>
                      <span className="text-[9px] text-white/30 uppercase tracking-widest font-light">Ledger</span>
                    </div>
                  </div>

                  {/* Mock Folder 2: Portfolio */}
                  <div className="flex flex-col items-center gap-2 group/folder cursor-default">
                    <div className="relative">
                      <div className="w-14 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/30 group-hover/folder:bg-pink-500/30 transition-all">
                        <Briefcase className="w-6 h-6 text-pink-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-[10px] flex items-center justify-center text-white">3</div>
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] text-white/70 block font-medium">Portfolio</span>
                      <span className="text-[9px] text-white/30 uppercase tracking-widest font-light">Impact</span>
                    </div>
                  </div>

                  {/* Mock Folder 3: Memories */}
                  <div className="flex flex-col items-center gap-2 group/folder cursor-default">
                    <div className="relative">
                      <div className="w-14 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30 group-hover/folder:bg-amber-500/30 transition-all">
                        <FileText className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] flex items-center justify-center text-white">4.2k</div>
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] text-white/70 block font-medium">Memories</span>
                      <span className="text-[9px] text-white/30 uppercase tracking-widest font-light">Entities</span>
                    </div>
                  </div>

                  {/* Mock Folder 4: Reflections */}
                  <div className="flex flex-col items-center gap-2 group/folder cursor-default">
                    <div className="relative">
                      <div className="w-14 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover/folder:bg-emerald-500/30 transition-all">
                        <RefreshCw className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] flex items-center justify-center text-white">12</div>
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] text-white/70 block font-medium">Reflections</span>
                      <span className="text-[9px] text-white/30 uppercase tracking-widest font-light">Growth</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Insights */}
          <div
            className="md:col-span-1 rounded-[2rem] bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-[1px] relative group transition-all duration-500 hover:-translate-y-1"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.9) 0px 24px 48px -12px' }}
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
            <div
              className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden p-8 flex flex-col justify-between"
              style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}
            >
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              ></div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="relative h-[140px] flex items-start justify-center pt-2">
                  <div
                    className="absolute top-[68px] w-[80%] h-14 rounded-3xl opacity-40 blur-[2px]"
                    style={{ background: '#111', boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.8)' }}
                  ></div>
                  <div
                    className="absolute top-[48px] w-[90%] h-[68px] rounded-[1.5rem]"
                    style={{
                      background: '#2a2a2a',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.08), inset 0 -10px 20px rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  ></div>
                  <div
                    className="absolute top-2 w-[100%] bg-[#fcfcfc] rounded-[1.5rem] p-3.5 flex items-center gap-3.5 z-10 transition-transform duration-500 hover:-translate-y-1"
                    style={{
                      boxShadow: '0 15px 30px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 6px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(255,255,255,0.5)',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: 'linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)',
                        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 10px rgba(225, 29, 72, 0.3)',
                      }}
                    >
                      <Bell className="text-white w-5 h-5 drop-shadow-md" />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex justify-between items-end mb-0.5">
                        <h4 className="text-xs sm:text-sm font-medium text-[#111] truncate tracking-tight">Extracted Today</h4>
                        <span className="text-xs text-[#888] shrink-0 font-light">Just now</span>
                      </div>
                      <p className="text-xs text-[#666] leading-[1.3] truncate font-light">Vela identified a new decision in your notes.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-normal text-white mb-2">Memory Synthesis</h3>
                  <p className="text-xs text-white/40 leading-relaxed font-light">
                    Vela automatically connects dots across your timeline to generate a living history of your work.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Engine */}
          <div
            className="md:col-span-1 rounded-[2rem] bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-[1px] relative group transition-all duration-500 hover:-translate-y-1"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.9) 0px 24px 48px -12px' }}
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
            <div
              className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden p-8 flex flex-col justify-between"
              style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}
            >
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              ></div>
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center mb-12 mt-2 ml-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="User"
                    className="w-[52px] h-[52px] rounded-full object-cover relative z-30 transition-transform duration-300 hover:scale-110"
                    style={{ border: '2.5px solid #1a1a1a', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                    alt="User"
                    className="w-[52px] h-[52px] rounded-full object-cover -ml-4 relative z-20 transition-transform duration-300 hover:scale-110"
                    style={{ border: '2.5px solid #1a1a1a', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                    alt="User"
                    className="w-[52px] h-[52px] rounded-full object-cover -ml-4 relative z-10 transition-transform duration-300 hover:scale-110"
                    style={{ border: '2.5px solid #1a1a1a', boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-normal text-white mb-2">Impact Resumé</h3>
                  <p className="text-xs text-white/40 leading-relaxed font-light">
                    Your achievements are distilled into professional narratives, ready for your next career move.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Canvas */}
          <div
            className="md:col-span-2 rounded-[2rem] bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-[1px] relative group transition-all duration-500 hover:-translate-y-1"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.9) 0px 24px 48px -12px' }}
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
            <div
              className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden p-8 flex flex-col md:flex-row gap-8"
              style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}
            >
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              ></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full h-full">
                <div className="md:w-5/12 flex flex-col justify-center">
                  <h3
                    className="text-lg md:text-xl font-normal tracking-tight text-white mb-2"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    Autonomous Synthesis
                  </h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed">
                    Vela works in the background to co-relate data and update your graph without friction.
                  </p>
                </div>

                <div
                  className="md:w-7/12 relative h-[200px] md:h-auto rounded-[1.25rem] overflow-hidden"
                  style={{ background: '#111', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div
                    className="h-10 px-4 flex items-center justify-between"
                    style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  >
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)' }}></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)' }}></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)' }}></div>
                    </div>
                    <div className="flex gap-3 text-[#555]">
                      <Sidebar className="w-4 h-4" />
                      <ChevronLeft className="w-4 h-4" />
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div className="w-10"></div>
                  </div>

                  <div className="relative h-[calc(100%-40px)] w-full overflow-hidden pointer-events-none">
                    <div className="cursor-anim absolute top-4 right-12 flex flex-col items-start animate-bounce">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#3b82f6] -rotate-[15deg] drop-shadow-md z-10"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
                      >
                        <path
                          d="M4.5 3L19.5 9.5L12 12L9.5 19.5L4.5 3Z"
                          fill="currentColor"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <div
                        className="mt-1 ml-4 px-3 py-1.5 rounded-full text-xs font-normal text-white shadow-lg whitespace-nowrap z-0 relative tracking-wide"
                        style={{
                          background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 10px rgba(0,0,0,0.4)',
                        }}
                      >
                        AI Extraction
                      </div>
                    </div>

                    <div className="cursor-anim absolute bottom-6 left-8 flex flex-col items-start animate-pulse" style={{ animationDelay: '-2s' }}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[#8b5cf6] -rotate-[15deg] drop-shadow-md z-10"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
                      >
                        <path
                          d="M4.5 3L19.5 9.5L12 12L9.5 19.5L4.5 3Z"
                          fill="currentColor"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <div
                        className="mt-1 ml-4 px-3 py-1.5 rounded-full text-xs font-normal text-white shadow-lg whitespace-nowrap z-0 relative tracking-wide"
                        style={{
                          background: 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
                          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 10px rgba(0,0,0,0.4)',
                        }}
                      >
                        Synthesis Engine
                      </div>
                    </div>

                    <svg width="100%" height="100%" className="absolute inset-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 10 50 Q 50 10 90 50 T 170 50" fill="transparent" stroke="white" strokeWidth="0.5" strokeDasharray="2 4"></path>
                      <circle cx="80%" cy="40%" r="20" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 3"></circle>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Foundation Architecture Section */}
      <section className="sm:px-6 sm:pb-32 sm:pt-32 w-full z-10 pt-16 pr-4 pb-16 pl-4 relative">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 relative"
            style={{
              background: 'linear-gradient(180deg, #1e1e1e 0%, #0a0a0a 100%)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.8), 0 8px 16px -4px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
             <div className="absolute inset-0 rounded-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '3px 3px' }}></div>
             <LayoutDashboard className="w-4 h-4 text-white/80 relative z-10 animate-pulse" style={{ animationDuration: '3s', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }} />
             <span className="text-xs font-normal text-white/90 tracking-wide uppercase relative z-10" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>Foundation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.1] text-white mb-6" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
             The infrastructure that makes
             <br />
             <span className="italic font-light text-white/90 font-serif">— everything possible.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-lg leading-relaxed font-light" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
             Built upon modern, battle-tested foundations. Fast by default, secure by design, and scalable from a team of five to an organization of thousands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1080px] mr-auto ml-auto gap-x-5 gap-y-5">
           {/* Knowledge Core Card */}
           <div className="rounded-[2rem] bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-[1px] relative group transition-all duration-500 hover:-translate-y-1" style={{ boxShadow: 'rgba(0, 0, 0, 0.9) 0px 24px 48px -12px' }}>
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
              <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden flex flex-col" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}>
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                 <div className="h-[280px] w-full relative z-10 flex items-center justify-center p-6 border-b border-white/[0.03]">
                    <svg className="w-full h-full opacity-80 mix-blend-screen" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.3)" className="animate-pulse" style={{ animationDuration: '2s' }}></circle>
                       <circle cx="250" cy="80" r="1" fill="rgba(255,255,255,0.3)" className="animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></circle>
                       <circle cx="200" cy="30" r="1" fill="rgba(255,255,255,0.2)" className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></circle>
                       <g transform="translate(150, 160)">
                          <ellipse cx="0" cy="0" rx="80" ry="40" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></ellipse>
                          <ellipse cx="0" cy="0" rx="60" ry="30" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" className="animate-pulse" style={{ animationDuration: '4s' }}></ellipse>
                          <path d="M-40, -10 L0, 10 L40, -10 L0, -30 Z" fill="rgba(20,20,20,0.8)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"></path>
                          <path d="M-40, -10 L0, 10 L0, 20 L-40, 0 Z" fill="rgba(10,10,10,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"></path>
                          <path d="M40, -10 L0, 10 L0, 20 L40, 0 Z" fill="rgba(15,15,15,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"></path>
                          <path d="M-20, -70 L-20, -20 A20,10 0 0,0 20,-20 L20, -70 Z" fill="url(#cylGrad1)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"></path>
                          <ellipse cx="0" cy="-70" rx="20" ry="10" fill="rgba(30,30,30,0.9)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"></ellipse>
                          <ellipse cx="0" cy="-20" rx="20" ry="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" className="animate-[spin_6s_linear_infinite]" style={{ transformOrigin: '0px -20px' }}></ellipse>
                          <path d="M0, -50 L40, -80" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" style={{ animationDuration: '2s' }}></path>
                          <path d="M0, -40 L-40, -60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }}></path>
                          <g transform="translate(40, -80) scale(0.6)" className="animate-pulse" style={{ animationDuration: '3s' }}>
                             <path d="M-10,0 L0,5 L10,0 L0,-5 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)"></path>
                             <path d="M-10,0 L0,5 L0,15 L-10,10 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)"></path>
                             <path d="M10,0 L0,5 L0,15 L10,10 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)"></path>
                          </g>
                          <g transform="translate(-40, -60) scale(0.5)" className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                             <path d="M-10,0 L0,5 L10,0 L0,-5 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)"></path>
                             <path d="M-10,0 L0,5 L0,15 L-10,10 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)"></path>
                             <path d="M10,0 L0,5 L0,15 L10,10 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)"></path>
                          </g>
                       </g>
                       <defs>
                          <linearGradient id="cylGrad1" x1="-20" y1="-45" x2="20" y2="-45" gradientUnits="userSpaceOnUse">
                             <stop offset="0" stopColor="rgba(20,20,20,0.9)"></stop>
                             <stop offset="0.5" stopColor="rgba(40,40,40,0.9)"></stop>
                             <stop offset="1" stopColor="rgba(10,10,10,0.9)"></stop>
                          </linearGradient>
                       </defs>
                    </svg>
                 </div>
                 <div className="p-6 md:p-8 flex-1 flex flex-col justify-end relative z-10">
                     <h3 className="text-lg md:text-xl font-normal tracking-tight text-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>State Synchronization</h3>
                     <p className="text-sm text-white/50 font-light leading-relaxed">Real-time bi-directional data flow ensures every client represents the absolute source of truth without manual refresh.</p>
                 </div>
              </div>
           </div>

           {/* Security Card */}
           <div className="rounded-[2rem] bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-[1px] relative group transition-all duration-500 hover:-translate-y-1" style={{ boxShadow: 'rgba(0, 0, 0, 0.9) 0px 24px 48px -12px' }}>
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
              <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden flex flex-col" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}>
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                 <div className="h-[280px] w-full relative z-10 flex items-center justify-center p-6 border-b border-white/[0.03]">
                    <svg className="w-full h-full opacity-80 mix-blend-screen" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                       {/* Abstract Security/Encryption Rings */}
                       <circle cx="150" cy="120" r="60" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></circle>
                       <circle cx="150" cy="120" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 8" className="animate-[spin_12s_linear_infinite]" style={{ transformOrigin: '150px 120px' }}></circle>
                       <circle cx="150" cy="120" r="30" fill="rgba(20,20,20,0.8)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"></circle>
                       
                       <g className="animate-pulse" style={{ animationDuration: '3s' }}>
                          <path d="M142 115 L158 115 M142 125 L158 125" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"></path>
                          <circle cx="150" cy="120" r="3" fill="rgba(255,255,255,0.9)"></circle>
                       </g>

                       {/* Data lines */}
                       <path d="M150 60 L150 20 M150 180 L150 220" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 4"></path>
                       <path d="M90 120 L50 120 M210 120 L250 120" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 4"></path>
                       <path d="M107 77 L77 47 M193 163 L223 193" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></path>
                       <path d="M193 77 L223 47 M107 163 L77 193" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></path>

                       {/* Encrypted Data Packets */}
                       <rect x="148" y="30" width="4" height="4" fill="rgba(255,255,255,0.8)" className="animate-pulse" style={{ animationDuration: '1.5s' }}></rect>
                       <rect x="148" y="206" width="4" height="4" fill="rgba(255,255,255,0.5)" className="animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></rect>
                       <rect x="60" y="118" width="4" height="4" fill="rgba(255,255,255,0.6)" className="animate-pulse" style={{ animationDuration: '1.8s', animationDelay: '1s' }}></rect>
                       <rect x="236" y="118" width="4" height="4" fill="rgba(255,255,255,0.7)" className="animate-pulse" style={{ animationDuration: '2.2s', animationDelay: '0.2s' }}></rect>
                    </svg>
                 </div>
                 <div className="p-6 md:p-8 flex-1 flex flex-col justify-end relative z-10">
                     <h3 className="text-lg md:text-xl font-normal tracking-tight text-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Zero-Trust Security</h3>
                     <p className="text-sm text-white/50 font-light leading-relaxed">Enterprise-grade encryption at rest and in transit. Your intellectual property and workflow data remains entirely yours.</p>
                 </div>
              </div>
           </div>

           {/* Performance Card */}
           <div className="rounded-[2rem] bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-[1px] relative group transition-all duration-500 hover:-translate-y-1" style={{ boxShadow: 'rgba(0, 0, 0, 0.9) 0px 24px 48px -12px' }}>
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
              <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden flex flex-col" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}>
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                 <div className="h-[280px] w-full relative z-10 flex items-center justify-center p-6 border-b border-white/[0.03]">
                    <svg className="w-full h-full opacity-80 mix-blend-screen" viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                       {/* Abstract Network Grid */}
                       <path d="M50 120 Q 150 20 250 120 T 450 120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"></path>
                       <path d="M50 140 Q 150 60 250 140 T 450 140" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></path>
                       <path d="M50 160 Q 150 100 250 160 T 450 160" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1"></path>
                       
                       {/* Nodes */}
                       <circle cx="100" cy="70" r="3" fill="rgba(255,255,255,0.8)" className="animate-pulse" style={{ animationDuration: '2s' }}></circle>
                       <circle cx="150" cy="85" r="4" fill="rgba(255,255,255,1)" style={{ boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}></circle>
                       <circle cx="200" cy="70" r="3" fill="rgba(255,255,255,0.6)" className="animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></circle>
                       
                       {/* Connections */}
                       <path d="M100 70 L150 85 L200 70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2"></path>
                       <path d="M150 85 L150 120" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"></path>
                       
                       {/* Dynamic Wave Graph */}
                       <rect x="98" y="180" width="4" height="20" rx="2" fill="rgba(255,255,255,0.1)" className="animate-pulse" style={{ animationDuration: '1.5s' }}></rect>
                       <rect x="118" y="160" width="4" height="40" rx="2" fill="rgba(255,255,255,0.2)" className="animate-pulse" style={{ animationDuration: '1.8s' }}></rect>
                       <rect x="138" y="140" width="4" height="60" rx="2" fill="rgba(255,255,255,0.3)" className="animate-pulse" style={{ animationDuration: '2.1s' }}></rect>
                       <rect x="158" y="130" width="4" height="70" rx="2" fill="rgba(255,255,255,0.6)" className="animate-pulse" style={{ animationDuration: '1.9s' }}></rect>
                       <rect x="178" y="150" width="4" height="50" rx="2" fill="rgba(255,255,255,0.4)" className="animate-pulse" style={{ animationDuration: '2.3s' }}></rect>
                       <rect x="198" y="170" width="4" height="30" rx="2" fill="rgba(255,255,255,0.2)" className="animate-pulse" style={{ animationDuration: '1.6s' }}></rect>
                    </svg>
                 </div>
                 <div className="p-6 md:p-8 flex-1 flex flex-col justify-end relative z-10">
                     <h3 className="text-lg md:text-xl font-normal tracking-tight text-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Global Scalability</h3>
                     <p className="text-sm text-white/50 font-light leading-relaxed">Built on edge-computing principles to guarantee sub-50ms latency regardless of team volume or geographic dispersion.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </>
  );
}
