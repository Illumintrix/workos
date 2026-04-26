import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Key, ExternalLink, Check, Loader2, X, Zap } from 'lucide-react';
import { useAppStore } from '../../store';

export function ApiKeyPromptModal() {
  const { isApiKeyModalOpen, setApiKeyModalOpen, updateSettings } = useAppStore();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isApiKeyModalOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim().startsWith('sk-or-')) {
      // Use standard styling for alert or a better feedback
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
      }, 1200);
    } catch (error) {
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  }

  const isValid = apiKey.trim().startsWith('sk-or-');

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-[#0a0a0a] border border-white/[0.08] rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Zap className="w-4 h-4 text-white/70" />
            </div>
            <h2 className="text-sm font-medium text-white tracking-tight">Intelligence Setup</h2>
          </div>
          <button 
            onClick={() => setApiKeyModalOpen(false)} 
            className="p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Context */}
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-medium text-white tracking-tight">Activate AI Workflows</h3>
            <p className="text-sm text-white/40 font-light leading-relaxed">
              Connect your <span className="text-white/60">OpenRouter</span> account to enable automated task extraction, document synthesis, and intelligence-driven navigation.
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">1. Access Protocol</label>
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                    <ExternalLink className="w-3.5 h-3.5 text-white/40" />
                  </div>
                  <span className="text-sm text-white/60 font-light">Generate OpenRouter API Key</span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="text-[9px] text-green-400 font-medium uppercase tracking-widest">Free Tier Available</span>
                </div>
              </a>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">2. Key Configuration</label>
              <div className="relative group">
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className={`
                    w-full bg-white/[0.02] border rounded-2xl px-5 py-4.5 text-sm text-white focus:outline-none transition-all placeholder:text-white/10 font-mono
                    ${isValid ? 'border-blue-500/30' : 'border-white/[0.06] focus:border-white/20'}
                  `}
                />
                <Key className={`absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors pointer-events-none ${isValid ? 'text-blue-400/40' : 'text-white/5'}`} />
              </div>
              <p className="text-[10px] text-white/20 font-light ml-1">
                Your key is stored locally in your browser and never shared with our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/[0.05] flex items-center gap-2">
          <button
            onClick={() => setApiKeyModalOpen(false)}
            className="flex-1 px-6 py-4 rounded-2xl text-white/40 text-sm font-light hover:text-white/60 hover:bg-white/[0.02] transition-all"
          >
            Setup Later
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || isSaving || isSuccess}
            className={`
              flex-[1.5] px-6 py-4 rounded-2xl text-sm font-medium transition-all shadow-2xl flex items-center justify-center gap-2
              ${isSuccess 
                ? 'bg-green-500 text-white' 
                : isValid 
                  ? 'bg-white text-black hover:bg-white/90 shadow-white/10' 
                  : 'bg-white/5 text-white/20 cursor-not-allowed'}
            `}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Intelligence Active
              </>
            ) : (
              'Activate Intelligence'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
