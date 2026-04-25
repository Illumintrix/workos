import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Layers, Loader2, ArrowRight, Mail, Lock } from 'lucide-react';
import { Icon } from '@iconify/react';
import { AmbientBackground } from '../components/AmbientBackground';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Supabase signup might require email confirmation depending on settings
        setError("Please check your email for confirmation link.");
        setLoading(false);
        return;
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-white/10 overflow-hidden">
      <AmbientBackground />
      
      {/* Mesh Gradient Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#333] to-[#111] flex items-center justify-center border border-black mb-4 shadow-2xl" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.5)' }}>
            <Layers className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-normal tracking-tight text-white mb-2">
            {isLogin ? 'Welcome back to Vela' : 'Join Vela'}
          </h1>
          <p className="text-sm text-white/40 font-light">
            {isLogin ? 'Enter your credentials to access your workspace.' : 'Your work, navigated.'}
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-b from-[#1e1e1e] to-[#0f0f0f] p-[1px] shadow-2xl overflow-hidden" style={{ boxShadow: '0 24px 48px -12px rgba(0,0,0,0.8)' }}>
          <div className="w-full h-full rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#0c0c0c] p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '6px 6px' }}></div>
            
            <form onSubmit={handleAuth} className="relative z-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 font-light uppercase tracking-widest mb-2 block">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-white/[0.05] rounded-xl text-sm text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-white/40 font-light uppercase tracking-widest block">Password</label>
                    {isLogin && (
                      <button type="button" className="text-[10px] text-white/20 hover:text-white/40 transition-colors">Forgot password?</button>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-white/[0.05] rounded-xl text-sm text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-light">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group"
              >
                <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-b from-white/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-full py-3.5 rounded-xl bg-gradient-to-b from-[#333] to-[#111] flex items-center justify-center gap-2 overflow-hidden shadow-lg">
                  {loading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <>
                      <span className="text-sm font-normal tracking-wide text-white">{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.05]"></div>
                </div>
                <span className="relative px-4 text-[10px] text-white/20 uppercase tracking-widest bg-[#0c0c0c]">or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/[0.05] hover:bg-white/[0.02] transition-all text-xs font-light text-white/60">
                  <Icon icon="mdi:github" className="w-4 h-4" />
                  GitHub
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/[0.05] hover:bg-white/[0.02] transition-all text-xs font-light text-white/60">
                  <Icon icon="mdi:google" className="w-4 h-4" />
                  Google
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-light text-white/40 hover:text-white/60 transition-colors"
          >
            {isLogin ? "Don't have an account? " : "Already part of Vela? "}
            <span className="text-white border-b border-white/20 pb-0.5 hover:border-white/60 transition-colors ml-1">
              {isLogin ? 'Create one now' : 'Sign in instead'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
