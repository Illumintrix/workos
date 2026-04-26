import { Layers } from 'lucide-react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.05] relative z-10 bg-[#050505] overflow-hidden">
      {/* Subtle noise overlay on footer */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '4px 4px' }}
      ></div>
      
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12 mb-16 relative z-10">
          <div className="col-span-2 lg:col-span-2 flex flex-col items-start pr-8">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-8 h-8 rounded-full bg-gradient-to-b from-[#333] to-[#111] flex items-center justify-center border border-white/[0.1]" 
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)' }}
              >
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-normal text-white tracking-tight">VELA</span>
            </div>
            <p className="text-xs text-white/40 font-light leading-relaxed max-w-xs mb-8">
              The smart workspace for elite individuals. Navigate your work, capture your impact, and build your career history.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-white/[0.05] bg-white/[0.02] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-all">
                <Icon icon="mdi:twitter" className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/[0.05] bg-white/[0.02] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-all">
                <Icon icon="mdi:github" className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-white/[0.05] bg-white/[0.02] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.05] transition-all">
                <Icon icon="mdi:discord" className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-normal text-white mb-2">Product</h4>
            <a href="#features" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">Features</a>
            <a href="#" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">Integrations</a>
            <a href="#" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">Pricing</a>
            <Link to="/changelog" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide flex items-center gap-2">
              Changelog
              <span className="px-1.5 py-0.5 rounded-sm bg-white/10 text-[10px] text-white/80">New</span>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-normal text-white mb-2">Company</h4>
            <Link to="/about" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">About Us</Link>
            <a href="#" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">Careers</a>
            <Link to="/blog" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">Blog</Link>
            <a href="#" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">Contact</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-normal text-white mb-2">Legal</h4>
            <Link to="/privacy" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">Terms of Service</Link>
            <a href="#" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide">Security</a>
            <a href="#" className="text-xs text-white/50 hover:text-white transition-colors font-light tracking-wide flex items-center gap-2">
              System Status
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></div>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <span className="text-xs text-white/40 font-light tracking-wide">© 2026 Vela Technologies Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
