import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AmbientBackground } from '../components/AmbientBackground';
import { GitBranch, Star, Zap } from 'lucide-react';

export function ChangelogPage() {
  const updates = [
    {
      version: 'v1.2.0',
      date: 'April 20, 2026',
      title: 'Enhanced Career Synthesis',
      description: 'Major improvements to how Vela summarizes your monthly achievements into portfolio-ready entries.',
      type: 'feature'
    },
    {
      version: 'v1.1.5',
      date: 'April 12, 2026',
      title: 'Mobile App Optimization',
      description: 'Reduced load times by 40% on mobile devices and improved offline capture reliability.',
      type: 'performance'
    },
    {
      version: 'v1.1.0',
      date: 'March 28, 2026',
      title: 'OpenRouter Integration',
      description: 'Bring your own API key to power Vela with the world\'s most advanced AI models for free.',
      type: 'feature'
    }
  ];

  return (
    <div className="relative min-h-screen text-white bg-[#050505] overflow-x-hidden selection:bg-white/10 font-sans">
      <AmbientBackground />
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-32 relative z-10 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 bg-white/5 border border-white/10">
            <Zap className="w-3 h-3 text-white/60" />
            <span className="text-[10px] font-normal text-white/70 tracking-[0.2em] uppercase">Updates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white mb-6" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Changelog
          </h1>
          <p className="text-base text-white/40 font-light max-w-2xl">
            See how Vela is evolving to help you navigate your career with pure simplicity.
          </p>
        </div>

        <div className="space-y-12">
          {updates.map((update, idx) => (
            <div key={idx} className="relative pl-10 sm:pl-16 group">
              {/* Timeline Line */}
              {idx !== updates.length - 1 && (
                <div className="absolute left-[19px] sm:left-[27px] top-10 bottom-0 w-[1px] bg-white/[0.05]" />
              )}
              
              {/* Timeline Dot */}
              <div className="absolute left-0 top-1.5 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#0a0a0a] border border-white/[0.08] flex items-center justify-center z-10" style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)' }}>
                {update.type === 'feature' ? (
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white transition-colors" />
                ) : (
                  <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white transition-colors" />
                )}
              </div>

              <div 
                className="p-8 rounded-[32px] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.05] relative transition-transform duration-500 hover:-translate-y-1"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 24px 48px -12px rgba(0,0,0,0.8)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <span className="text-[11px] text-white/30 font-medium uppercase tracking-widest">{update.version} • {update.date}</span>
                </div>
                <h2 className="text-xl text-white font-normal mb-3 tracking-tight">{update.title}</h2>
                <p className="text-white/40 font-light leading-relaxed">{update.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
