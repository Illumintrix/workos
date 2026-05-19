import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';
import { Loader2 } from 'lucide-react';
import { useAppStore } from './store';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { InboxPage } from './pages/InboxPage';
import { TasksPage } from './pages/TasksPage';
import { NotesPage } from './pages/NotesPage';
import { DecisionsPage } from './pages/DecisionsPage';
import { ReflectionsPage } from './pages/ReflectionsPage';
import { TimelinePage } from './pages/TimelinePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { GraphPage } from './pages/GraphPage';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { BlogPage } from './pages/BlogPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { supabase } from './lib/supabase';

function App() {
  const { updateSettings, syncWithSupabase, user, setUser, isInitialized } = useAppStore();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) {
        syncWithSupabase();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        syncWithSupabase();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, syncWithSupabase]);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        updateSettings({ hasCompletedOnboarding: true });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showWelcome, updateSettings]);

  if (showWelcome) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] z-[100] flex flex-col items-center justify-center animate-in fade-in duration-1000">
        <div className="text-center max-w-lg px-6 animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-300 fill-mode-both">
          <h1 className="text-3xl font-normal text-white mb-4 tracking-tight">Your work, <span className="text-white/40">navigated.</span></h1>
          <p className="text-white/40 font-light text-lg">Just tell me what's on your mind.</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth & Landing */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Root Route Logic */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/app" replace /> : <LandingPage />} 
        />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Protected Application Routes */}
        <Route element={user ? <AppLayout /> : <Navigate to="/" replace />}>
          <Route path="/app" element={<HomePage />} />
          <Route path="/chat/:id" element={<HomePage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/decisions" element={<DecisionsPage />} />
          <Route path="/reflections" element={<ReflectionsPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
