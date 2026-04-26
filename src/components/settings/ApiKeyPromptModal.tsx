import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Key, ExternalLink, Check, Loader2, X, Sparkles, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store';

export function ApiKeyPromptModal() {
  const { isApiKeyModalOpen, setApiKeyModalOpen, updateSettings } = useAppStore();
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isApiKeyModalOpen) return null;

  const handleSave = async () => {
    if (!apiKey.trim().startsWith('sk-or-')) return;

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

  const isValid = apiKey.trim().startsWith('sk-or-');

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
      <div 
        className="w-full max-w-lg bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.05] rounded-[32px] p-8 relative animate-in zoom-in-95 duration-500 overflow-hidden"
        style={{
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.8), 0 32px 64px -16px rgba(0,0,0,0.9)'
        }}
      >
        {/* Background Texture (Radial Dots) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            opacity: 0.015
          }}
        />

        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-white/[0.02] blur-[60px] pointer-events-none" />

        <button 
          onClick={() => setApiKeyModalOpen(false)}
          className="absolute top-8 right-8 text-white/20 hover:text-white transition-all hover:rotate-90 duration-300 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 relative z-10"
          style={{
            background: 'linear-gradient(180deg, #1e1e1e 0%, #0a0a0a 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Sparkles className="w-3 h-3 text-white/60" />
          <span className="text-[9px] font-normal text-white/70 tracking-[0.2em] uppercase">Intelligence Activation</span>
        </div>
        
        <h3 
          className="text-2xl font-normal text-white mb-3 tracking-tight z-10 relative"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
        >
          Connect OpenRouter
        </h3>
        <p className="text-sm text-white/40 font-light mb-10 leading-relaxed z-10 relative">
          Vela requires an intelligence channel to structure your natural language. It's free to initialize and powers all automated synthesis.
        </p>

        <div className="space-y-8 z-10 relative">
          {/* Step 1: External Link Card */}
          <div className="space-y-3">
            <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">1. Generate Protocol</label>
            <a 
              href="https://openrouter.ai/keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent transition-all hover:from-white/20"
            >
              <div 
                className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-4 flex items-center justify-between"
                style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/[0.05] group-hover:bg-white/10 transition-colors">
                    <ExternalLink className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white/80 font-light tracking-tight">OpenRouter.ai/keys</span>
                    <span className="text-[10px] text-green-500/60 font-normal">Free credits usually available</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
              </div>
            </a>
          </div>

          {/* Step 2: Input Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] ml-1">2. Configuration</label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-white/[0.05] to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="relative w-full bg-black/40 border border-white/[0.05] rounded-2xl p-5 pr-14 text-white text-sm focus:outline-none focus:border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all placeholder:text-white/10 font-mono"
              />
              <Key className={`absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isValid ? 'text-blue-400/40' : 'text-white/5'}`} />
            </div>
            <p className="text-[10px] text-white/20 font-light ml-1 flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500/40" />
              Keys are stored locally and never shared with our servers.
            </p>
          </div>
        </div>

        <div className="flex justify-end items-center gap-6 mt-12 z-10 relative">
          <button
            onClick={() => setApiKeyModalOpen(false)}
            className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid || isSaving || isSuccess}
            className="px-8 py-3.5 bg-gradient-to-b from-[#2e2e2e] to-[#141414] text-white text-xs font-medium rounded-xl transition-all flex items-center gap-3 disabled:opacity-50 disabled:grayscale border border-white/[0.05] active:scale-95 group"
            style={{
              boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.15), inset 0 -2px 8px rgba(0,0,0,0.8), 0 12px 24px -6px rgba(0,0,0,0.9)'
            }}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSuccess ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-white/80 group-hover:rotate-12 transition-transform" />
            )}
            {isSaving ? 'Initializing...' : isSuccess ? 'Activated' : 'Activate Intelligence'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
