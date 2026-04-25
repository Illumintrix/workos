import { Brain } from 'lucide-react';

interface AIMessageProps {
  content: string;
  timestamp: string;
}

export function AIMessage({ content, timestamp }: AIMessageProps) {
  return (
    <div className="flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* AI Avatar */}
      <div
        className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#2a2a2a] to-[#111] flex items-center justify-center shrink-0 mt-1"
        style={{
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Brain className="w-4 h-4 text-amber-400/80" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }} />
      </div>

      {/* Message bubble */}
      <div className="flex flex-col gap-1 min-w-0">
        <div
          className="px-5 py-4 rounded-2xl rounded-tl-md bg-gradient-to-b from-[#1a1a1a] to-[#111] relative overflow-hidden"
          style={{
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          {/* Noise texture */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
              backgroundSize: '4px 4px',
            }}
          />
          <p className="text-sm text-white/80 font-light leading-relaxed relative z-10 whitespace-pre-wrap">
            {content}
          </p>
        </div>
        <span className="text-[10px] text-white/30 font-light ml-2">
          {new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
