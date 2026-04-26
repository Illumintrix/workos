import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Key, ExternalLink, ShieldCheck, Zap, Info, Check, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store';

export function ApiKeyPromptModal() {
  const { isApiKeyModalOpen, setApiKeyModalOpen, settings, updateSettings } = useAppStore();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isApiKeyModalOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim().startsWith('sk-or-')) {
      alert('Please enter a valid OpenRouter API key (starts with sk-or-)');
      return;
    }

    setIsSaving(true);
    try {
      await updateSettings({ openaiApiKey: apiKey.trim() });
      setIsSuccess(true);
      setTimeout(() => {
        setApiKeyModalOpen(false);
        setIsSuccess(false);
        setApiKey('');
      }, 1500);
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-xl bg-[#0a0a0a] border border-white/[0.08] rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 relative"
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/10 blur-[80px] pointer-events-none" />

        <div className="p-8 sm:p-10 relative z-10">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-xl relative group">
              <Key className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 rounded-2xl bg-blue-400/10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-normal text-white tracking-tight">AI Intelligence Requires a Key</h3>
              <p className="text-sm text-white/40 font-light leading-relaxed max-w-md mx-auto">
                To power your work OS with state-of-the-art models, you need an <span className="text-white/60 font-medium">OpenRouter API Key</span>. It's completely free to start.
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400/60" />
                <span className="text-[10px] text-white/60 uppercase tracking-widest font-medium">Free Tier</span>
                <span className="text-[10px] text-white/20 text-center font-light leading-tight">Access Gemma 3, GPT-OSS and more for $0.</span>
              </div>
              <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400/60" />
                <span className="text-[10px] text-white/60 uppercase tracking-widest font-medium">Privacy First</span>
                <span className="text-[10px] text-white/20 text-center font-light leading-tight">Your key is stored locally and securely.</span>
              </div>
            </div>

            <div className="w-full space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-[10px] text-white/20 uppercase tracking-[0.2em] ml-1 font-semibold">Step 1: Get your key</label>
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-white/40" />
                    </div>
                    <span className="text-sm text-white/80 font-light">Visit OpenRouter.ai/keys</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/20 uppercase tracking-[0.2em] ml-1 font-semibold">Step 2: Paste it here</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm font-light placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-blue-500/40" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 border-t border-white/[0.05] flex gap-2">
          <button
            onClick={() => setApiKeyModalOpen(false)}
            className="flex-1 px-6 py-4 rounded-[32px] text-white/40 text-sm font-light hover:text-white/60 transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || isSaving || isSuccess}
            className={`
              flex-[1.5] px-6 py-4 rounded-[32px] text-sm font-medium transition-all shadow-xl flex items-center justify-center gap-2
              ${isSuccess 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white text-black hover:bg-white/90 disabled:opacity-30'}
            `}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Key Active
              </>
            ) : (
              'Save & Activate'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
