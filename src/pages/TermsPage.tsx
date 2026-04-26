import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AmbientBackground } from '../components/AmbientBackground';

export function TermsPage() {
  return (
    <div className="relative min-h-screen text-white bg-[#050505] overflow-x-hidden selection:bg-white/10 font-sans">
      <AmbientBackground />
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-32 relative z-10 max-w-3xl">
        <div className="mb-12">
          <h1 className="text-3xl font-normal tracking-tight text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Terms of Service
          </h1>
          <p className="text-[11px] text-white/30 font-light uppercase tracking-widest">Last updated: April 26, 2026</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-12">
          <section className="space-y-4">
            <h2 className="text-xl font-normal text-white">1. Service Definition</h2>
            <p className="text-white/40 font-light leading-relaxed">
              Vela is an "all-in-one" workspace provided for professional organization. The software is provided "as is," and while we strive for 100% reliability, we are not responsible for any data loss or service interruptions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-normal text-white">2. Usage Requirements</h2>
            <p className="text-white/40 font-light leading-relaxed">
              To use Vela's AI features, you must provide your own API key from a supported provider (OpenRouter). You are responsible for any costs incurred through your API provider.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-normal text-white">3. Ethical Use</h2>
            <p className="text-white/40 font-light leading-relaxed">
              You agree not to use Vela for any illegal purposes or to process data that violates third-party rights. Vela is intended for professional development and workspace management.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-normal text-white">4. Updates to Terms</h2>
            <p className="text-white/40 font-light leading-relaxed">
              We may update these terms as we add new features. Continued use of the platform after updates constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
