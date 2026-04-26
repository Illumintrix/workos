import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AmbientBackground } from '../components/AmbientBackground';

export function PrivacyPage() {
  return (
    <div className="relative min-h-screen text-white bg-[#050505] overflow-x-hidden selection:bg-white/10 font-sans">
      <AmbientBackground />
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-32 relative z-10 max-w-3xl">
        <div className="mb-12">
          <h1 className="text-3xl font-normal tracking-tight text-white mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Privacy Policy
          </h1>
          <p className="text-[11px] text-white/30 font-light uppercase tracking-widest">Last updated: April 26, 2026</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-12">
          <section className="space-y-4">
            <h2 className="text-xl font-normal text-white">1. Data Ownership</h2>
            <p className="text-white/40 font-light leading-relaxed">
              Vela is built on a "Bring Your Own Key" (BYOK) model. Your OpenRouter API key is stored locally in your browser's encrypted storage and is never transmitted to our servers. Your workspace data—tasks, notes, and professional history—belongs entirely to you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-normal text-white">2. Local Storage</h2>
            <p className="text-white/40 font-light leading-relaxed">
              To provide a fast and secure experience, Vela uses local storage technologies to keep your work history available offline. This data remains on your device unless you explicitly choose to sync it with a cloud provider (like Supabase) for multi-device access.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-normal text-white">3. Third-Party Services</h2>
            <p className="text-white/40 font-light leading-relaxed">
              When you use AI features, your natural language input is sent to OpenRouter (and the specific models you select) for processing. These interactions are subject to the privacy policies of OpenRouter and the respective AI providers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-normal text-white">4. No Tracking</h2>
            <p className="text-white/40 font-light leading-relaxed">
              We do not track your specific work actions, project titles, or the content of your professional memory. We may collect anonymous, aggregated usage statistics (e.g., "how many users active today") to improve the service infrastructure.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
