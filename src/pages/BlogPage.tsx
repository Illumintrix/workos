import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AmbientBackground } from '../components/AmbientBackground';
import { BookOpen, ArrowRight } from 'lucide-react';

export function BlogPage() {
  const posts = [
    {
      title: 'The Future of Career Management',
      excerpt: 'Why traditional resumes are dying and how autonomous workspace memory is taking over.',
      date: 'April 25, 2026',
      readTime: '6 min read',
      category: 'Vision',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
    },
    {
      title: 'Mastering Natural Language Capture',
      excerpt: 'Tips and tricks for using natural language to organize your daily work life without friction.',
      date: 'April 18, 2026',
      readTime: '4 min read',
      category: 'Guides',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80'
    },
    {
      title: 'Privacy in the Age of AI',
      excerpt: 'How Vela keeps your data local and secure while still providing powerful intelligence.',
      date: 'April 10, 2026',
      readTime: '5 min read',
      category: 'Security',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'
    }
  ];

  return (
    <div className="relative min-h-screen text-white bg-[#050505] overflow-x-hidden selection:bg-white/10 font-sans">
      <AmbientBackground />
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-32 relative z-10 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 bg-white/5 border border-white/10">
            <BookOpen className="w-3 h-3 text-white/60" />
            <span className="text-[10px] font-normal text-white/70 tracking-[0.2em] uppercase">Journal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-white mb-6" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Blog
          </h1>
          <p className="text-base text-white/40 font-light max-w-2xl">
            Thoughts on AI, career growth, and the evolution of the modern workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col rounded-[32px] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.05] overflow-hidden transition-all duration-500 hover:-translate-y-2"
              style={{ boxShadow: '0 24px 48px -12px rgba(0,0,0,0.8)' }}
            >
              <div className="h-48 overflow-hidden relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] text-white/80 font-medium uppercase tracking-widest">{post.category}</span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[10px] text-white/30 uppercase tracking-widest font-medium mb-4">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl text-white font-normal mb-3 tracking-tight group-hover:text-white/90 transition-colors leading-snug">{post.title}</h2>
                <p className="text-sm text-white/40 font-light leading-relaxed mb-8 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-white/60 text-sm font-light group/link cursor-pointer">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
