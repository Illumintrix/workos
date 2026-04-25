import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Architecture } from '../components/Architecture';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';
import { AmbientBackground } from '../components/AmbientBackground';

export function LandingPage() {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden selection:bg-white/10">
      <AmbientBackground />
      <Navbar />
      <Hero />
      <Features />
      <Architecture />
      <CTA />
      <Footer />
    </div>
  );
}
