import { Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <header
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-5xl z-50 rounded-full p-[1px]"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.02) 100%)',
        boxShadow: '0 16px 32px -8px rgba(0,0,0,0.8)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] backdrop-blur-2xl relative overflow-hidden"
        style={{
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -2px 6px rgba(0,0,0,0.8)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        ></div>

        <div className="flex items-center gap-3 relative z-10">
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-b from-[#333] to-[#111] flex items-center justify-center border border-black"
            style={{
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6)',
            }}
          >
            <Layers className="text-white/90 w-4 h-4" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }} />
          </div>
          <span
            className="text-sm font-normal text-white tracking-tighter"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            VELA
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 relative z-10">
          <a
            href="#features"
            className="text-sm font-light text-white/70 hover:text-white transition-colors"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            Features
          </a>
          <a
            href="#architecture"
            className="text-sm font-light text-white/70 hover:text-white transition-colors"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            Architecture
          </a>
          <a
            href="#impact"
            className="text-sm font-light text-white/70 hover:text-white transition-colors"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            Impact
          </a>
        </nav>

        <div className="flex items-center gap-4 relative z-10">
          <Link
            to="/auth"
            className="hidden md:block text-sm font-light text-white/70 hover:text-white transition-colors"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            Log in
          </Link>
          <div className="relative inline-flex group cursor-pointer">
            <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-b from-white/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <Link
              to="/auth"
              className="relative px-5 py-1.5 rounded-full text-xs font-normal text-white bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a]"
              style={{
                boxShadow:
                  'inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 3px rgba(0,0,0,0.6), 0 4px 8px -2px rgba(0,0,0,0.6)',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
