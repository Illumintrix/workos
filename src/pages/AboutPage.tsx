import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AmbientBackground } from '../components/AmbientBackground';
import { Sparkles, Heart, Shield } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="relative min-h-screen text-white bg-[#050505] overflow-x-hidden selection:bg-white/10 font-sans">
      <AmbientBackground />
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-32 relative z-10 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 bg-white/5 border border-white/10">
            <Sparkles className="w-3 h-3 text-white/60" />
            <span className="text-[10px] font-normal text-white/70 tracking-[0.2em] uppercase">Our Story</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white mb-8 leading-[1.1]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            We believe your work <br />
            <span className="italic font-light text-white/90 font-serif">— deserves to be remembered.</span>
          </h1>
          <p className="text-lg text-white/50 font-light max-w-2xl leading-relaxed">
            Vela was built to bridge the gap between daily effort and professional growth. We create tools that capture the nuances of your work, so you can focus on building the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="space-y-6">
            <h2 className="text-2xl font-normal text-white tracking-tight">The Problem</h2>
            <p className="text-white/40 font-light leading-relaxed">
              In the modern workspace, most of our wins, decisions, and growth are lost in the noise of Slack, emails, and Jira. Resumes are static and often fail to reflect the true depth of our contributions.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-normal text-white tracking-tight">Our Solution</h2>
            <p className="text-white/40 font-light leading-relaxed">
              Vela works as a smart layer on top of your natural workflow. By listening and organizing in real-time, we create a living history of your career that is always ready, always accurate, and always yours.
            </p>
          </div>
        </div>

        <div 
          className="p-12 rounded-[40px] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.05] relative overflow-hidden"
          style={{ boxShadow: '0 32px 64px -16px rgba(0,0,0,0.8)' }}
        >
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-8">
              <Shield className="w-8 h-8 text-white/40" />
            </div>
            <h2 className="text-3xl font-normal text-white mb-6 tracking-tight">Privacy First, Always.</h2>
            <p className="text-white/40 font-light leading-relaxed max-w-2xl mb-10">
              Your career data is your most valuable asset. We built Vela with a local-first philosophy. Your keys are stored in your browser, and your data is encrypted. We are a tool, not a data broker.
            </p>
            <div className="flex items-center gap-2 text-white/20 text-sm font-light">
              <Heart className="w-4 h-4 text-red-500/40" />
              <span>Made with care for builders everywhere.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
