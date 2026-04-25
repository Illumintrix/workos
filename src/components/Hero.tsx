import { FolderGit2, Rocket, ArrowRight, Link, Plus, MoreHorizontal, Calendar, Paperclip, MessageSquare, Sparkles, Layers } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

export function Hero() {
  return (
    <main className="container sm:px-12 lg:px-24 h-screen min-h-[800px] max-h-[1000px] xl:max-h-[950px] flex flex-col lg:flex-row lg:gap-0 overflow-hidden z-10 mr-auto ml-auto pt-40 pr-6 pb-20 pl-6 relative gap-x-12 gap-y-12 items-center justify-between animate-in fade-in duration-1000">
      <div className="w-full lg:w-5/12 flex flex-col items-start pt-12 lg:pt-0 z-20">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 relative"
          style={{
            background: 'linear-gradient(180deg, #1e1e1e 0%, #0a0a0a 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.8), 0 8px 16px -4px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '3px 3px',
            }}
          ></div>
          <FolderGit2 className="w-4 h-4 text-white/80 relative z-10" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }} />
            <span
              className="text-xs font-normal text-white/90 tracking-wide uppercase relative z-10"
              style={{ textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}
            >
              Intelligence OS
            </span>
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.1] text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          Your work, organized.
          <br />
          <span className="italic font-light text-white/90 font-serif">— by pure intelligence.</span>
        </h1>
        <p
          className="text-sm sm:text-base text-white/60 max-w-sm leading-relaxed font-light animate-in fade-in slide-in-from-bottom-6 duration-1000"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Stop managing tools. Start doing your best work. Vela listens to your natural language and instantly structures your tasks, notes, and career memory.
        </p>
        <div className="mt-10 relative inline-flex group">
          <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
          <RouterLink
            to="/auth"
            className="relative flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-b from-[#2e2e2e] to-[#141414] text-white overflow-hidden"
            style={{
              boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.9)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
                backgroundSize: '4px 4px',
              }}
            ></div>
            <span
              className="text-sm font-normal tracking-wide relative z-10"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
            >
              Initialize Workspace
            </span>
            <Rocket className="w-4 h-4 text-white/90 relative z-10" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))' }} />
          </RouterLink>
        </div>
      </div>

      <div
        className="w-full lg:w-7/12 relative h-[500px] sm:h-[600px] lg:h-[650px] xl:h-[750px] flex items-center justify-center pointer-events-none"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative w-full max-w-[600px] aspect-square"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-18deg) rotateX(12deg) rotateZ(4deg)' }}
        >
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#181818] to-[#0a0a0a] overflow-hidden relative"
            style={{
              transform: 'translateZ(-100px) scale(1.1)',
              boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.08), inset 0 -2px 12px rgba(0,0,0,0.9), 0 24px 48px -12px rgba(0,0,0,0.9)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
                backgroundSize: '6px 6px',
              }}
            ></div>
            <div className="h-16 border-b border-white/[0.04] flex items-center px-6 gap-4 opacity-50 relative z-10">
              <span className="text-xs text-white/60 tracking-wide font-light">Intelligence Graph</span>
              <ArrowRight className="w-3 h-3 text-white/40" />
              <span className="text-xs text-white/60 tracking-wide font-light">Cross-Entity Linking</span>
            </div>
            <div className="p-6 opacity-40 flex flex-col gap-6 relative z-10">
              <h2
                className="text-xl font-normal tracking-tight text-white flex items-center gap-2"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              >
                Synthesized Career Portfolio
                <Link className="w-4 h-4 text-white/50" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }} />
              </h2>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70 font-light">Insights</span>
                    <Sparkles className="w-4 h-4 text-white/50" />
                  </div>
                  <div
                    className="h-32 rounded-xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.03]"
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
                  ></div>
                  <div
                    className="h-24 rounded-xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.03]"
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
                  ></div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70 font-light">Synthesis</span>
                    <Layers className="w-4 h-4 text-white/50" />
                  </div>
                  <div
                    className="h-24 rounded-xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.03]"
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6" style={{ transform: 'translateZ(50px)' }}>
            <div
              className="w-[90%] sm:w-[420px] rounded-2xl bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-[1px] relative"
              style={{ boxShadow: '0 24px 48px -12px rgba(0,0,0,0.9)', transform: 'translateX(20px) translateY(-30px)' }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
              <div
                className="w-full h-full rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}
              >
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                  }}
                ></div>
                <div
                  className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] relative z-10"
                  style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
                >
                  <span className="text-xs font-normal text-white/80" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    Recent Capture
                  </span>
                  <div className="flex items-center gap-2 text-white/50">
                    <Plus className="w-4 h-4" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }} />
                    <MoreHorizontal className="w-4 h-4" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }} />
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="px-2.5 py-1 rounded bg-gradient-to-b from-[#3a1d1d] to-[#241010] text-[#ff8a8a] text-xs font-normal tracking-wide border border-[#522525]"
                      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.4)', textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}
                    >
                      Critical Decision
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/[0.05] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] text-xs text-white/70"
                      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.4)', textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Extracted Today
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-sm sm:text-base text-white font-normal mb-1.5 tracking-tight"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      Autonomous Extraction
                    </h3>
                    <p
                      className="text-xs text-white/50 leading-relaxed font-light line-clamp-3"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      "Let's move the DB to the edge. AL agreed." <br/>
                      <span className="text-white/80">→ Extracted: Decision, Risk Note, and 2 follow-up tasks.</span>
                    </p>
                  </div>
                  <div className="mt-2">
                    <div
                      className="w-full h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden border border-white/[0.05]"
                      style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      <div className="h-full bg-gradient-to-r from-white/40 to-white/90 rounded-full w-3/4" style={{ boxShadow: '0 0 8px rgba(255,255,255,0.2)' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-4 border-t border-white/[0.04]">
                    <div className="flex items-center -space-x-2">
                      <div className="w-7 h-7 rounded-full border-2 border-[#1a1a1a] bg-gradient-to-b from-[#555] to-[#333] flex items-center justify-center text-xs text-white/90" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.5)', textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>JD</div>
                      <div className="w-7 h-7 rounded-full border-2 border-[#1a1a1a] bg-gradient-to-b from-[#444] to-[#222] flex items-center justify-center text-xs text-white/90" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.5)', textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>AL</div>
                      <div className="w-7 h-7 rounded-full border-2 border-[#1a1a1a] bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center text-xs text-white/60" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.5)', textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>+3</div>
                    </div>
                    <div className="flex items-center gap-3 text-white/50 text-xs font-light">
                      <div className="flex items-center gap-1" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }}>
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>4</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }}>
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="w-[90%] sm:w-[420px] rounded-2xl bg-gradient-to-b from-[#1e1e1e] to-[#121212] p-[1px] relative"
              style={{ boxShadow: '0 24px 48px -12px rgba(0,0,0,0.9)', transform: 'translateX(-30px) translateY(10px)' }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none"></div>
              <div
                className="w-full h-full rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8)' }}
              >
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
                    backgroundSize: '4px 4px',
                  }}
                ></div>
                <div className="p-5 flex flex-col gap-4 relative z-10">
                  <div className="absolute top-4 right-4 text-white/40">
                    <MoreHorizontal className="w-4 h-4" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="px-2.5 py-1 rounded bg-gradient-to-b from-[#1d3a24] to-[#102415] text-[#8affb1] text-xs font-normal tracking-wide border border-[#2b5936]"
                      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.4)', textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}
                    >
                      Standard
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/[0.05] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] text-xs text-white/70"
                      style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.4)', textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Jan 05, 2025
                    </div>
                  </div>
                  <div className="pr-6">
                    <h3
                      className="text-sm sm:text-base text-white font-normal mb-1.5 tracking-tight"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      Career Memory Synthesis
                    </h3>
                    <p
                      className="text-xs text-white/50 leading-relaxed font-light line-clamp-3"
                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      Vela synthesized 42 fragmented logs into a cohesive impact narrative: <br/>
                      <span className="text-white/80">"Led architectural pivot, reducing TTI by 40%."</span>
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <div
                      className="w-full h-1.5 bg-[#0a0a0a] rounded-full overflow-hidden border border-white/[0.05]"
                      style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      <div className="h-full bg-gradient-to-r from-white/40 to-white/90 rounded-full w-[30%]" style={{ boxShadow: '0 0 8px rgba(255,255,255,0.2)' }}></div>
                    </div>
                    <span className="text-xs text-white/50 whitespace-nowrap font-light" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>
                      2 / 7
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-4 border-t border-white/[0.04]">
                    <div className="flex items-center -space-x-2">
                      <div className="w-7 h-7 rounded-full border-2 border-[#1a1a1a] bg-gradient-to-b from-[#444] to-[#222] flex items-center justify-center text-xs text-white/90" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.5)', textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>MK</div>
                    </div>
                    <div className="flex items-center gap-3 text-white/50 text-xs font-light">
                      <div className="flex items-center gap-1" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }}>
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>1</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }}>
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
