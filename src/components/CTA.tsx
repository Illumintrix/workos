import { Sparkles, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section id="impact" className="w-full pt-32 pb-40 relative z-10 flex justify-center px-6 overflow-hidden">
      {/* Glow effect specific to CTA */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[40vh] bg-gradient-to-t from-white/5 to-transparent blur-[100px] pointer-events-none rounded-full" 
        style={{ mixBlendMode: 'screen' }}
      ></div>
      
      <div className="max-w-3xl text-center flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 border border-white/[0.05] bg-white/[0.02] backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-white/60" />
          <span className="text-xs font-normal text-white/60 tracking-wide uppercase">Get Started</span>
        </div>
        <h2 
          className="text-4xl sm:text-5xl lg:text-7xl font-normal tracking-tight leading-[1.05] text-white mb-8" 
          style={{ textShadow: '0 4px 8px rgba(0,0,0,0.6)' }}
        >
          Ready to transform how you
          <br />
          <span className="italic font-light text-white/90 font-serif">— work?</span>
        </h2>
        <p 
          className="text-sm sm:text-base text-white/50 max-w-md leading-relaxed font-light mb-12" 
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
        >
          Experience a simpler way to manage your professional life. Vela is the smart workspace that helps you grow.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative inline-flex group">
            <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-b from-white/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <Link
              to="/auth"
              className="relative flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-b from-[#333] to-[#111] text-white overflow-hidden transition-all duration-300 group-hover:from-[#3a3a3a] group-hover:to-[#151515]"
              style={{
                boxShadow:
                  'inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 3px rgba(0,0,0,0.6), 0 12px 24px -6px rgba(0,0,0,0.8)',
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
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              >
                Launch Workspace
              </span>
              <Rocket
                className="w-4 h-4 text-white/90 relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
